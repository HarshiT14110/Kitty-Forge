import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { FileCode, FileJson, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EditorProps {
  files: Record<string, string>;
  activeFile: string;
  onFileSelect: (fileName: string) => void;
  onFileChange: (fileName: string, content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({
  files,
  activeFile,
  onFileSelect,
  onFileChange,
}) => {
  const fileNames = Object.keys(files);

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".html")) return <FileText className="w-4 h-4 text-orange-400" />;
    if (fileName.endsWith(".css")) return <FileCode className="w-4 h-4 text-blue-400" />;
    if (fileName.endsWith(".js")) return <FileCode className="w-4 h-4 text-yellow-400" />;
    return <FileJson className="w-4 h-4 text-emerald-400" />;
  };

  const getLanguage = (fileName: string) => {
    if (fileName.endsWith(".html")) return "html";
    if (fileName.endsWith(".css")) return "css";
    if (fileName.endsWith(".js")) return "javascript";
    return "json";
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-white/10">
      {/* File Tabs */}
      <div className="flex bg-[#252526] border-b border-white/5 overflow-x-auto scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {fileNames.map((fileName) => (
            <motion.button
              key={fileName}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onFileSelect(fileName)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-all relative group ${
                activeFile === fileName
                  ? "bg-[#1e1e1e] text-white"
                  : "text-white/40 hover:bg-white/5 hover:text-white/60"
              }`}
            >
              {getFileIcon(fileName)}
              <span className="truncate max-w-[120px]">{fileName}</span>
              {activeFile === fileName && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={getLanguage(activeFile)}
          theme="vs-dark"
          value={files[activeFile] || ""}
          onChange={(value) => onFileChange(activeFile, value || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: "'JetBrains Mono', monospace",
            lineNumbers: "on",
            renderLineHighlight: "all",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
    </div>
  );
};
