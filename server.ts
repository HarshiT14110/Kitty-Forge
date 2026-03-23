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
let ai;

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
  console.error("❌ AI not initialized");
  return res.status(500).json({ error: "AI not initialized" });
}
    const response = await Promise.race([
  ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: `
You are an expert frontend developer.

USER REQUEST:
"${prompt}"

Return ONLY valid JSON. No markdown.
`,
      },
    ],
  }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("AI timeout")), 15000)
  ),
]);

    const text =
      response?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p.text)
        ?.join("") || "";

    if (!text) {
      console.error("❌ Empty AI response:", response);
      return res.status(500).json({ error: "Empty AI response" });
    }

    console.log("✅ AI RESPONSE:", text);

    res.json({ result: text });
  } catch (error) {
    console.error("❌ SERVER ERROR:", error);
    res.status(500).json({ error: "Failed to generate" });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});