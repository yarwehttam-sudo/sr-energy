import { createHash } from 'node:crypto';
import { handleLeadRequest, type LeadDeliveryProvider, type LeadRequest } from '@/lib/leadEndpoint';

const NOTION_VERSION = '2022-06-28';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTION_RICH_TEXT_LIMIT = 2_000;
const NOTION_LEAD_BLOCK_TYPE = 'sr-energy-lead-v1';
const NOTION_RECEIPT_BLOCK_TYPE = 'sr-energy-lead-receipt-v1';

const html = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);

function validConfiguredEmail(value: string | undefined) {
  return value && EMAIL_PATTERN.test(value) ? value : null;
}

interface NotionLeadRecord extends LeadRequest {
  lead_created_at: string;
  milestones: Record<string, never>;
}

interface NotionBlockEnvelope {
  type: typeof NOTION_LEAD_BLOCK_TYPE;
  index: number;
  total: number;
  sha256: string;
  payload: string;
}

function codeBlock(content: string) {
  return {
    object: 'block',
    type: 'code',
    code: { language: 'json', rich_text: [{ type: 'text', text: { content } }] },
  };
}

function envelopeText(payload: string, index: number, total: number, sha256: string) {
  return JSON.stringify({ type: NOTION_LEAD_BLOCK_TYPE, index, total, sha256, payload } satisfies NotionBlockEnvelope);
}

function serializeNotionLead(lead: LeadRequest, leadCreatedAt: string) {
  const record: NotionLeadRecord = {
    ...lead,
    lead_created_at: leadCreatedAt,
    milestones: {},
  };
  return JSON.stringify(record);
}

function notionLeadBlocks(serialized: string) {
  const sha256 = createHash('sha256').update(serialized).digest('hex');
  const chunks: string[] = [];
  let current = '';
  for (const character of serialized) {
    if (envelopeText(current + character, chunks.length, 99, sha256).length > NOTION_RICH_TEXT_LIMIT) {
      if (!current) throw new Error('unable to encode Notion lead chunk');
      chunks.push(current);
      current = character;
    } else {
      current += character;
    }
  }
  if (current || !chunks.length) chunks.push(current);
  if (chunks.length > 98) throw new Error('Notion lead requires too many blocks');
  return chunks.map((payload, index) => codeBlock(envelopeText(payload, index, chunks.length, sha256)));
}

function richTextContent(block: unknown) {
  if (!block || typeof block !== 'object') return null;
  const code = (block as { code?: { rich_text?: Array<{ plain_text?: string; text?: { content?: string } }> } }).code;
  if (!code?.rich_text) return null;
  return code.rich_text.map((item) => item.plain_text ?? item.text?.content ?? '').join('');
}

function verifyNotionPersistence(results: unknown[], expected: string, pageId: string) {
  const envelopes = results.flatMap((block) => {
    const content = richTextContent(block);
    if (!content) return [];
    try {
      const value = JSON.parse(content) as Record<string, unknown>;
      return value.type === NOTION_LEAD_BLOCK_TYPE ? [value] : [];
    } catch {
      return [];
    }
  });
  if (!envelopes.length) return false;
  const total = envelopes[0].total;
  const sha256 = envelopes[0].sha256;
  if (!Number.isInteger(total) || total !== envelopes.length || typeof sha256 !== 'string') return false;
  const ordered = [...envelopes].sort((left, right) => Number(left.index) - Number(right.index));
  if (ordered.some((item, index) => item.index !== index || item.total !== total || item.sha256 !== sha256 || typeof item.payload !== 'string')) return false;
  const reconstructed = ordered.map((item) => item.payload).join('');
  if (reconstructed !== expected || createHash('sha256').update(reconstructed).digest('hex') !== sha256) return false;
  try {
    JSON.parse(reconstructed);
  } catch {
    return false;
  }

  return results.some((block) => {
    const content = richTextContent(block);
    if (!content) return false;
    try {
      const value = JSON.parse(content) as Record<string, unknown>;
      return value.type === NOTION_RECEIPT_BLOCK_TYPE && value.provider === 'notion' && value.persistence_id === pageId;
    } catch {
      return false;
    }
  });
}

function emailProvider(): LeadDeliveryProvider | null {
  const apiKey = process.env.RESEND_API_KEY;
  const to = validConfiguredEmail(process.env.LEAD_NOTIFICATION_EMAIL);
  const from = validConfiguredEmail(process.env.LEAD_FROM_EMAIL);
  if (!apiKey || !to || !from) return null;

  return {
    name: 'email',
    async deliver(lead: LeadRequest, leadCreatedAt: string, signal: AbortSignal) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal,
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `SR Energy Website <${from}>`,
          to: [to],
          subject: `New ${lead.product_intent} request: ${lead.name}`,
          html: `<h2>New home energy request</h2><p><strong>Created:</strong> ${html(leadCreatedAt)}</p><p><strong>Name:</strong> ${html(lead.name)}</p><p><strong>Email:</strong> ${html(lead.email)}</p><p><strong>Phone:</strong> ${html(lead.phone)}</p><p><strong>ZIP / market:</strong> ${html(lead.zip)} / ${html(lead.market)}</p><p><strong>Intent:</strong> ${html(lead.product_intent)}</p><p><strong>Homeowner:</strong> ${lead.homeowner ? 'Yes' : 'No'}</p><p><strong>Consent:</strong> Yes</p><pre>${html(JSON.stringify(lead.attribution, null, 2))}</pre>`,
        }),
      });
      if (!response.ok) throw new Error(`email provider status ${response.status}`);
      const result = await response.json() as { id?: string };
      return result.id ?? null;
    },
  };
}

function notionProvider(): LeadDeliveryProvider | null {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.LEAD_NOTION_DATABASE_ID;
  if (!apiKey || !databaseId) return null;

  return {
    name: 'notion',
    async deliver(lead: LeadRequest, leadCreatedAt: string, signal: AbortSignal) {
      const serialized = serializeNotionLead(lead, leadCreatedAt);
      const children = notionLeadBlocks(serialized);
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        signal,
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Notion-Version': NOTION_VERSION },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties: {
            'Contact Name': { title: [{ text: { content: lead.name } }] },
            Email: { email: lead.email },
            Phone: { phone_number: lead.phone },
            State: { rich_text: [{ text: { content: lead.market } }] },
            'Lead Source': { select: { name: 'Website' } },
            'Pipeline Stage': { select: { name: 'New Lead' } },
            Priority: { select: { name: 'Warm' } },
          },
          children,
        }),
      });
      if (!response.ok) throw new Error(`persistence provider status ${response.status}`);
      const result = await response.json() as { id?: string };
      if (!result.id) return null;

      const receipt = codeBlock(JSON.stringify({ type: NOTION_RECEIPT_BLOCK_TYPE, provider: 'notion', persistence_id: result.id }));
      const appendResponse = await fetch(`https://api.notion.com/v1/blocks/${result.id}/children`, {
        method: 'PATCH',
        signal,
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Notion-Version': NOTION_VERSION },
        body: JSON.stringify({ children: [receipt] }),
      });
      if (!appendResponse.ok) throw new Error(`persistence receipt status ${appendResponse.status}`);

      const verificationResponse = await fetch(`https://api.notion.com/v1/blocks/${result.id}/children?page_size=100`, {
        signal,
        headers: { Authorization: `Bearer ${apiKey}`, 'Notion-Version': NOTION_VERSION },
      });
      if (!verificationResponse.ok) throw new Error(`persistence verification status ${verificationResponse.status}`);
      const verification = await verificationResponse.json() as { results?: unknown[]; has_more?: boolean };
      if (verification.has_more || !verification.results || !verifyNotionPersistence(verification.results, serialized, result.id)) {
        throw new Error('persistence verification incomplete');
      }
      return result.id;
    },
  };
}

export async function POST(request: Request) {
  const providers = [emailProvider(), notionProvider()].filter((provider): provider is LeadDeliveryProvider => provider !== null);
  return handleLeadRequest(request, providers);
}