import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Notion config kept for later use
// const NOTION_API_KEY = process.env.NOTION_API_KEY;
// const DATABASE_ID = 'a254df33-d6e3-487e-9fc1-ebc6f5059900';

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, phone, email, message, state, monthlyBill, productInterest } =
      await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 },
      );
    }

    const productList =
      Array.isArray(productInterest) && productInterest.length > 0
        ? productInterest.join(', ')
        : '—';

    const html = `
      <h2 style="margin-bottom:16px;font-family:sans-serif;">New Lead — SR Energy Website</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;width:100%;max-width:560px;">
        <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;width:180px;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td></tr>
        <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${phone || '—'}</td></tr>
        <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${email}</td></tr>
        <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">State</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${state || '—'}</td></tr>
        <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Monthly Electric Bill</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${monthlyBill ? `$${monthlyBill}` : '—'}</td></tr>
        <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Product Interest</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${productList}</td></tr>
        <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;vertical-align:top;">Message</td><td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap;">${message || '—'}</td></tr>
      </table>
    `;

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'JoinUs@SREnergy.US',
      subject: `New Lead from SR Energy Website - ${name}`,
      html,
    });

    if (error) {
      console.error('Resend error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: error.message || JSON.stringify(error) },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }

  // ── Notion integration (commented out — fix separately) ──────────────────
  //
  // console.log('Notion response status:', notionRes.status);
  // const responseText = await notionRes.text();
  // console.log('Notion response body:', responseText);
  //
  // if (!notionRes.ok) {
  //   const notionError = (() => { try { return JSON.parse(responseText); } catch { return {}; } })();
  //   console.error('Notion API error:', JSON.stringify(notionError, null, 2));
  //   return NextResponse.json(
  //     { error: notionError.message || JSON.stringify(notionError) },
  //     { status: 500 },
  //   );
  // }
  //
  // Properties mapping:
  // 'Contact Name': { title: [{ text: { content: name } }] },
  // 'Email': { email },
  // 'Phone': { phone_number: phone },
  // 'Notes': { rich_text: [{ text: { content: message } }] },
  // 'State': { rich_text: [{ text: { content: state } }] },
  // 'Monthly Electric Bill': { number: Number(monthlyBill) },
  // 'Product Interest': { multi_select: productInterest.map((p) => ({ name: p })) },
  // 'Lead Source': { select: { name: 'Website' } },
  // 'Pipeline Stage': { select: { name: 'New Lead' } },
  // 'Priority': { select: { name: 'Warm' } },
}
