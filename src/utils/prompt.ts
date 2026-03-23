export const SYSTEM_PROMPT = `You are an expert web developer. Generate a complete, modern website/app based on the user's prompt.
            
Return ONLY a JSON object in this format:
{
  "files": {
    "index.html": "...",
    "style.css": "...",
    "script.js": "..."
  }
}

Include all necessary CSS and JS to make it look professional and functional. Use Tailwind CSS via CDN if helpful.
Do not include any markdown formatting like \`\`\`json. Just the raw JSON string.`;

export const DEFAULT_FILES = {
  "index.html": "<h1>Welcome to Kitty Forge!</h1><p>Type a prompt in the chat to build something amazing.</p>",
  "style.css": "body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f0fdf4; color: #065f46; }",
  "script.js": "console.log('Hello from Kitty Forge!');",
};
