import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `
You are an expert frontend developer.

USER REQUEST:
"${prompt}"

Return ONLY valid JSON:
{
  "files": {
    "index.html": "complete html with inline css and js"
  }
}
`,
        },
      ],
    });

    const text =
      response?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        ?.join("") || "";

    if (!text) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    // clean
    let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    const jsonString = cleaned.slice(start, end + 1);

    return res.status(200).json({ result: jsonString });

  } catch (error: any) {
    console.error("❌ Vercel API Error:", error);

    return res.status(500).json({
      error: error?.message || "Failed to generate",
    });
  }
}