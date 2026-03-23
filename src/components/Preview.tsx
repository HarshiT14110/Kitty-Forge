import React, { useMemo } from "react";
import { Play, RefreshCw, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface PreviewProps {
  files: Record<string, string>;
}

export const Preview: React.FC<PreviewProps> = ({ files }) => {
  const srcDoc = useMemo(() => {
    const html = files["index.html"] || "";
    const css = files["style.css"] || "";
    const js = files["script.js"] || "";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          ${css}
        </style>
      </head>
      <body class="bg-white text-black">
        ${html}
        <script>
          ${js}
        </script>
      </body>
      </html>
    `;
  }, [files]);

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl border-l border-white/10">
      <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-white/80">Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-white/10 text-white/60 rounded-lg transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-white/10 text-white/60 rounded-lg transition-all">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-white overflow-hidden relative">
        <iframe
          title="preview"
          srcDoc={srcDoc}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-modals allow-forms"
        />
      </div>
    </div>
  );
};
