import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isProductIntent, sanitizeAttributionValue, type LeadAttribution, type ProductIntent } from '@/lib/acquisition';
import { isServiceTerritory } from '@/lib/serviceTerritories';

const NOTION_DATABASE_ID = '410f33a7-f6c2-402d-849f-8b085c6110e6';
const NOTION_VERSION = '2022-06-28';

interface LeadRequest {
  name: string;
  phone: string;
  email: string;
  zip: string;
  market: string;
  product_intent: ProductIntent;
  homeowner: boolean;
  consent: boolean;
  attribution: LeadAttribution;
}

const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const html = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);

function normalizeAttribution(value: unknown): LeadAttribution | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const normalizeTouch = (touch: unknown) => {
    const item = touch && typeof touch === 'object' ? touch as Record<string, unknown> : {};
    return {
      landing_page: sanitizeAttributionValue(item.landing_page), referrer: sanitizeAttributionValue(item.referrer), captured_at: sanitizeAttributionValue(item.captured_at, 50),
      utm_source: sanitizeAttributionValue(item.utm_source), utm_medium: sanitizeAttributionValue(item.utm_medium), utm_campaign: sanitizeAttributionValue(item.utm_campaign), utm_term: sanitizeAttributionValue(item.utm_term), utm_content: sanitizeAttributionValue(item.utm_content), gclid: sanitizeAttributionValue(item.gclid), msclkid: sanitizeAttributionValue(item.msclkid),
    };
  };
  return { first_touch: normalizeTouch(record.first_touch), latest_touch: normalizeTouch(record.latest_touch) };
}

function parseLead(body: Record<string, unknown>): LeadRequest | null {
  const name = text(body.name, 100), phone = text(body.phone, 30), email = text(body.email, 254).toLowerCase(), zip = text(body.zip, 5), market = text(body.market, 2).toUpperCase(), intent = text(body.product_intent, 30), attribution = normalizeAttribution(body.attribution);
  if (!name || !phone || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{5}$/.test(zip) || !isServiceTerritory(market) || !isProductIntent(intent) || body.consent !== true || !attribution) return null;
  return { name, phone, email, zip, market, product_intent: intent, homeowner: body.homeowner === true, consent: true, attribution };
}

async function createNotionLead(data: LeadRequest, leadCreatedAt: string) {
  const notes = JSON.stringify({ zip: data.zip, market: data.market, product_intent: data.product_intent, homeowner: data.homeowner, consent: data.consent, lead_created_at: leadCreatedAt, attribution: data.attribution, milestones: {} });
  const properties = {
    'Contact Name': { title: [{ text: { content: data.name } }] }, Email: { email: data.email }, Phone: { phone_number: data.phone }, Notes: { rich_text: [{ text: { content: notes.slice(0, 1900) } }] }, State: { rich_text: [{ text: { content: data.market } }] },
    'Lead Source': { select: { name: 'Website' } }, 'Pipeline Stage': { select: { name: 'New Lead' } }, Priority: { select: { name: 'Warm' } },
  };
  const response = await fetch('https://api.notion.com/v1/pages', { method: 'POST', headers: { Authorization: `Bearer ${process.env.NOTION_API_KEY}`, 'Content-Type': 'application/json', 'Notion-Version': NOTION_VERSION }, body: JSON.stringify({ parent: { database_id: NOTION_DATABASE_ID }, properties }) });
  if (!response.ok) throw new Error(`Notion API error ${response.status}`);
  return response.json();
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const lead = parseLead(body);
    if (!lead) return NextResponse.json({ error: 'Please provide valid contact, ZIP, market, product intent, consent, and attribution fields.' }, { status: 400 });
    const leadCreatedAt = new Date().toISOString();
    const resend = new Resend(process.env.RESEND_API_KEY);
    let emailId: string | undefined;
    try {
      const emailResult = await resend.emails.send({ from: 'SR Energy Website <noreply@srenergy.us>', to: ['JoinUs@SREnergy.US'], subject: `New ${lead.product_intent} request: ${lead.name}`, html: `<h2>New home energy request</h2><p><strong>Created:</strong> ${html(leadCreatedAt)}</p><p><strong>Name:</strong> ${html(lead.name)}</p><p><strong>Email:</strong> ${html(lead.email)}</p><p><strong>Phone:</strong> ${html(lead.phone)}</p><p><strong>ZIP / market:</strong> ${html(lead.zip)} / ${html(lead.market)}</p><p><strong>Intent:</strong> ${html(lead.product_intent)}</p><p><strong>Homeowner:</strong> ${lead.homeowner ? 'Yes' : 'No'}</p><pre>${html(JSON.stringify(lead.attribution, null, 2))}</pre>` });
      if (emailResult.error) throw new Error(`Resend API error: ${emailResult.error.message}`);
      emailId = emailResult.data?.id;
    } catch (error) {
      console.error('Lead email delivery failed', error);
    }
    let notionPageId: string | undefined;
    try { notionPageId = (await createNotionLead(lead, leadCreatedAt) as { id?: string }).id; } catch (error) { console.error('Notion lead sync failed', error); }
    if (!emailId && !notionPageId) {
      return NextResponse.json({ error: 'Unable to save your request right now. Please try again.' }, { status: 502 });
    }
    return NextResponse.json({ success: true, lead_created_at: leadCreatedAt, delivery: { email: Boolean(emailId), notion: Boolean(notionPageId) } });
  } catch (error) {
    console.error('Contact form error', error);
    return NextResponse.json({ error: 'Unable to submit right now. Please try again.' }, { status: 500 });
  }
}