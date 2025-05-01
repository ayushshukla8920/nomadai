import { NextResponse } from 'next/server';
export async function POST(req) {
  const formData = await req.json();
  const prompt = generatePrompt(formData);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    const result = await response.json();
    const recommendations = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No recommendations returned.';
    return NextResponse.json({ recommendations });
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json({ error: 'Failed to get recommendations.' }, { status: 500 });
  }
}
function generatePrompt(data) {
  return `
A digital nomad is planning their next destination. Based on the following preferences, suggest 4–5 cities or regions around the world:

- City Name: ${data.city || 'Not specified'}
- Location Type: ${data.locationType}
- Internet Needs: ${data.internet}
- Budget: ${data.budget ? `$${data.budget}` : 'Not mentioned'}
- Weather Preference: ${data.weather}
- Accommodation: ${data.accommodation}
- Community Type: ${data.communityType}
- Transport Type: ${data.transport}
- Co-working Needed: ${data.coworking ? 'Yes' : 'No'}
- Noise Sensitive: ${data.noiseSensitive ? 'Yes' : 'No'}
- Pet Friendly: ${data.petFriendly ? 'Yes' : 'No'}
- Visa-Free Travel Required: ${data.visaFree ? 'Yes' : 'No'}

Provide a short justification for each suggestion, and ensure they match the lifestyle described.
  `;
}
