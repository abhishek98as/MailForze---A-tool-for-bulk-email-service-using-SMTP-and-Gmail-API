import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req) {
  try {
    const { subject, bodyHtml } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert email deliverability and marketing analyst.
Analyze the following email subject and HTML body for spam triggers, tone, and improvements.

Subject: ${subject}
Body:
${bodyHtml}

Provide your analysis strictly in JSON format with the following keys:
- spamScore: an integer from 0 to 10 (10 being very high risk of spam)
- spamReasons: an array of strings outlining reasons it might trigger spam filters
- tone: a string describing the tone (e.g., "Professional", "Urgent", "Salesy")
- suggestedSubject: a suggestion for a better subject line
- rewrittenBodyHtml: A rewritten version of the body HTML that is better optimized for deliverability and engagement, avoiding spam words. Return ONLY the HTML as a string inside this key.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON output from the model
    let parsed = {};
    try {
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', text);
      return NextResponse.json({ error: 'AI returned invalid format', raw: text }, { status: 500 });
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'AI Analysis failed' }, { status: 500 });
  }
}
