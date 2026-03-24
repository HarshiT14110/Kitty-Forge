export const generateApp = async (prompt: string) => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    // 🔥 Handle backend errors properly
    if (!response.ok) {
      let errorMessage = "Failed to generate app";

      try {
        const err = await response.json();
        errorMessage = err.error || errorMessage;
      } catch (_) {}

      throw new Error(errorMessage);
    }

    const data = await response.json();

    let raw = data.result;

    if (!raw) {
      throw new Error("Empty AI response");
    }

    // 🔥 remove markdown if present
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    // 🔥 extract JSON safely
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start === -1 || end === -1) {
      console.error("❌ INVALID RAW:", raw);
      throw new Error("Invalid JSON format");
    }

    const jsonString = raw.slice(start, end + 1);

    let parsed;

    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.error("❌ JSON PARSE ERROR:", jsonString);
      throw new Error("AI returned invalid JSON");
    }

    // 🔥 structure validation (VERY IMPORTANT)
    if (!parsed.files || !parsed.files["index.html"]) {
      console.error("❌ WRONG STRUCTURE:", parsed);
      throw new Error("AI returned wrong format");
    }

    return parsed;

  } catch (error: any) {
    console.error("❌ GENERATE ERROR:", error.message);
    throw error;
  }
};