import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const training_data = require('@/lib/system');
    const fetch = training_data+JSON.stringify(prompt);
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fetch }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });
    const data = result.response.candidates[0].content.parts[0].text;

    return Response.json({ reply: data });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }
}
