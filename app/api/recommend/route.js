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
A digital nomad is planning to stay in **${data.city || 'a city'}**. Based on the following preferences, suggest **4–5 ideal neighborhoods, districts, or localities** within this city that best suit their lifestyle.

User preferences:
- Location Type: ${data.locationType}
- Internet Needs: ${data.internet}
- Monthly Budget: ${data.budget ? `$${data.budget}` : 'Not mentioned'}
- Weather Preference: ${data.weather}
- Accommodation Type: ${data.accommodation}
- Community Vibe: ${data.communityType}
- Transport Access: ${data.transport}
- Needs Co-working Space: ${data.coworking ? 'Yes' : 'No'}
- Noise Sensitive: ${data.noiseSensitive ? 'Yes' : 'No'}
- Pet Friendly: ${data.petFriendly ? 'Yes' : 'No'}
- Requires Visa-Free Travel: ${data.visaFree ? 'Yes' : 'No'}

👉 Output format:
- List 4–5 areas **within ${data.city || 'this city'}**
- Mention 1–2 sentences for each explaining why it matches
- Focus on lifestyle compatibility, not general tourism
`;
}
