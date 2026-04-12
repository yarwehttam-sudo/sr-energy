import { NextRequest, NextResponse } from 'next/server';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = 'a254df33-d6e3-487e-9fc1-ebc6f5059900';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message, state, monthlyBill, productInterest } =
      await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 },
      );
    }

    if (!NOTION_API_KEY) {
      console.error('NOTION_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 },
      );
    }

    // Build Notion properties — only include optional fields when they have values
    const properties: Record<string, unknown> = {
      'Contact Name': { title: [{ text: { content: name } }] },
      'Email': { email },
      'Lead Source': { select: { name: 'Website' } },
      'Pipeline Stage': { select: { name: 'New Lead' } },
      'Priority': { select: { name: 'Warm' } },
    };

    if (phone) {
      properties['Phone'] = { phone_number: phone };
    }
    if (message) {
      properties['Notes'] = { rich_text: [{ text: { content: message } }] };
    }
    if (state) {
      properties['State'] = { rich_text: [{ text: { content: state } }] };
    }
    if (monthlyBill !== undefined && monthlyBill !== null && monthlyBill !== '') {
      properties['Monthly Electric Bill'] = { number: Number(monthlyBill) };
    }
    if (Array.isArray(productInterest) && productInterest.length > 0) {
      properties['Product Interest'] = {
        multi_select: productInterest.map((p: string) => ({ name: p })),
      };
    }

    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties,
      }),
    });

    console.log('Notion response status:', notionRes.status);
    const responseText = await notionRes.text();
    console.log('Notion response body:', responseText);

    if (!notionRes.ok) {
      const notionError = (() => { try { return JSON.parse(responseText); } catch { return {}; } })();
      console.error('Notion API error:', JSON.stringify(notionError, null, 2));
      return NextResponse.json(
        { error: notionError.message || JSON.stringify(notionError) },
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
}
