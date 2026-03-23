export const generateApp = async (prompt: string) => {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate app");
  }

  const data = await response.json();

try {
  const result = JSON.parse(data.result);let raw = data.result;

// 🔥 remove markdown
raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

// 🔥 extract only JSON part (VERY IMPORTANT FIX)
const start = raw.indexOf("{");
const end = raw.lastIndexOf("}");

if (start === -1 || end === -1) {
  throw new Error("Invalid JSON format");
}

const jsonString = raw.slice(start, end + 1);

// 🔥 safer parsing
const parsed = Function(`return ${jsonString}`)();

return parsed;
} catch (err) {
  console.error("❌ JSON parse error:", data.result);
  throw new Error("Invalid AI response format");
}
};