import { handleLeadRequest, type LeadDeliveryProvider, type LeadRequest } from '@/lib/leadEndpoint';

const NOTION_VERSION = '2022-06-28';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const html = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);

function validConfiguredEmail(value: string | undefined) {
  return value && EMAIL_PATTERN.test(value) ? value : null;
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
      const notes = JSON.stringify({
        zip: lead.zip,
        market: lead.market,
        product_intent: lead.product_intent,
        homeowner: lead.homeowner,
        consent: lead.consent,
        lead_created_at: leadCreatedAt,
        attribution: lead.attribution,
        milestones: {},
      });
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
            Notes: { rich_text: [{ text: { content: notes.slice(0, 1900) } }] },
            State: { rich_text: [{ text: { content: lead.market } }] },
            'Lead Source': { select: { name: 'Website' } },
            'Pipeline Stage': { select: { name: 'New Lead' } },
            Priority: { select: { name: 'Warm' } },
          },
        }),
      });
      if (!response.ok) throw new Error(`persistence provider status ${response.status}`);
      const result = await response.json() as { id?: string };
      return result.id ?? null;
    },
  };
}

export async function POST(request: Request) {
  const providers = [emailProvider(), notionProvider()].filter((provider): provider is LeadDeliveryProvider => provider !== null);
  return handleLeadRequest(request, providers);
}