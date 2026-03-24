import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
console.log("🔥 Starting server...");

const app = express();
console.log("✅ Express initialized");
const PORT = 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// Gemini setup
console.log("🔑 API KEY:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");

let ai: GoogleGenAI | null = null;

try {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });
  console.log("🤖 Gemini initialized");
} catch (err) {
  console.error("❌ Gemini init failed:", err);
}

// API route
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!ai) {
      return res.status(500).json({ error: "AI not initialized" });
    }

    console.log("📩 Prompt:", prompt);

    // 🔥 REMOVE TIMEOUT (important)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `
You are an expert frontend developer.

USER REQUEST:
"${prompt}"

Your task is to generate a COMPLETE working website.

IMPORTANT:
- DO NOT use via.placeholder.com
- Use https://picsum.photos for images
- DO NOT use external script.js or style.css
- Put ALL CSS inside <style> tag
- Put ALL JS inside <script> tag

STRICT RULES:
Return ONLY valid JSON in this exact format:
{
  "files": {
    "index.html": "complete html with inline css and js"
  }
}

- No markdown
- No explanation
- No extra text
- Only raw JSON
`,
        },
      ],
    });

    // 🔥 safer text extraction
    const text =
      response?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        ?.join("") || "";

    if (!text || text.length < 20) {
      console.error("❌ Empty AI response:", response);
      return res.status(500).json({ error: "Empty AI response" });
    }

    console.log("✅ RAW AI OUTPUT:", text);

    // 🔥 clean markdown
    let cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 🔥 extract JSON safely
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      console.error("❌ INVALID JSON FORMAT:", cleaned);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    const jsonString = cleaned.slice(start, end + 1);

    let parsed;

    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.error("❌ JSON PARSE ERROR:", jsonString);
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    // 🔥 validate structure
    if (!parsed.files || !parsed.files["index.html"]) {
      console.error("❌ WRONG STRUCTURE:", parsed);
      return res.status(500).json({ error: "Invalid AI response structure" });
    }

    console.log("🎉 SUCCESS: Valid response");

    res.json({ result: JSON.stringify(parsed) });

  } catch (error: any) {
    console.error("❌ SERVER ERROR FULL:", error);

    if (error?.status === 429) {
      return res.status(429).json({
        error: "Quota exceeded. Please wait and try again.",
      });
    }

    res.status(500).json({
      error: error?.message || "Failed to generate",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});