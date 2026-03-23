import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { Chat } from "../components/Chat";
import { Editor } from "../components/Editor";
import { Preview } from "../components/Preview";
import { CatAssistant } from "../components/CatAssistant";
import { generateApp } from "../utils/api";
import { DEFAULT_FILES } from "../utils/prompt";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Code, Eye } from "lucide-react";

export const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [files, setFiles] = useState<Record<string, string>>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState("index.html");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "🐱 Meow! I'm your AI assistant. What should we build today?" },
  ]);
  const [projects, setProjects] = useState([
    { id: "1", name: "My First App", date: "2026-03-22" },
  ]);
  const [leftWidth, setLeftWidth] = useState(70); // %
const [isDragging, setIsDragging] = useState(false);
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const [showCommand, setShowCommand] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (location.state?.initialPrompt) {
      handleSendMessage(location.state.initialPrompt);
      // Clear state to prevent re-triggering on refresh
      window.history.replaceState({}, document.title);
    }
  }, [user, navigate, location.state]);

  const handleSendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setIsGenerating(true);
    setMessages((prev) => [...prev, { role: "ai", text: "🐱 Generating your app... This might take a few seconds!" }]);

    try {
      const result = await generateApp(text);

console.log("AI RESULT:", result); // 🔥 ADD THIS
      if (result && result.files) {
        setFiles(result.files);
        const firstFile = Object.keys(result.files)[0];
        setActiveFile(firstFile);
        setMessages((prev) => {
          const filtered = prev.filter(m => m.text !== "🐱 Generating your app... This might take a few seconds!");
          return [...filtered, { role: "ai", text: "🐱 Purr-fect! I've generated your app. Check it out in the editor and preview!" }];
        });
        setView("preview"); 
      }
      else {
  throw new Error("No files returned from AI");
}
    } catch (error) {
      setMessages((prev) => {
        const filtered = prev.filter(m => m.text !== "🐱 Generating your app... This might take a few seconds!");
        return [...filtered, { role: "ai", text: "🐱 Oops! Something went wrong. Can you try again?" }];
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleNewProject = () => {
    setFiles(DEFAULT_FILES);
    setActiveFile("index.html");
    setMessages([{ role: "ai", text: "🐱 Ready for a new project! What's on your mind?" }]);
    setView("preview");
  };

  const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging) return;
  const newWidth = (e.clientX / window.innerWidth) * 100;
  if (newWidth > 20 && newWidth < 80) {
    setLeftWidth(newWidth);
  }
};

const handleMouseUp = () => setIsDragging(false);
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setShowCommand((prev) => !prev);
    }

    if (e.key === "Escape") {
      setShowCommand(false);
    }
  };

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, []);

useEffect(() => {
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}, [isDragging]);

  return (
    <div className="flex h-screen text-white overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#020617]">
      {/* 🌈 Background Glow */}
<div className="absolute inset-0 -z-10">
  <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />
  <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
</div>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewProject={handleNewProject}
        projects={projects}
        onProjectSelect={(id) => console.log("Select project", id)}
      />

      <main className="flex-1 flex flex-col relative">
        <Navbar user={user} onLogout={handleLogout} />
        
       <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40" />

        <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="flex-1 flex overflow-hidden transition-all duration-300"
>

  {/* LEFT SIDE */}
  <div
     style={{ width: `${leftWidth}%` }}
    className="flex flex-col border-r border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all duration-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_0_40px_rgba(139,92,246,0.15)]">
  
    {/* TOGGLE HEADER */}
    <div className="flex gap-2 px-3 py-2 border-b border-white/10 bg-white/[0.02] overflow-x-auto scrollbar-hide">
    {Object.keys(files).map((file) => (
    <button
      key={file}
      onClick={() => setActiveFile(file)}
      className={`px-3 py-1 text-xs rounded-md whitespace-nowrap transition-all ${
        activeFile === file
          ? "bg-purple-500/30 text-white"
          : "text-white/40 hover:text-white hover:bg-white/10"
      }`}
    >
      {file}
    </button>
  ))}
</div>
<div
  onMouseDown={() => setIsDragging(true)}
  className="w-[4px] cursor-col-resize bg-white/10 hover:bg-purple-500 transition-all"
/>
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03] backdrop-blur-xl">

  <div className="flex gap-2 bg-white/5 p-1 rounded-lg">

    <button
      onClick={() => setView("preview")}
      className={`px-4 py-1.5 rounded-md text-sm transition-all ${
        view === "preview"
          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
          : "text-white/60 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
      }`}
    >
      👁 Preview
    </button>

    <button
      onClick={() => setView("code")}
      className={`px-4 py-1.5 rounded-md text-sm transition-all ${
        view === "code"
  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
  : "text-white/40 hover:text-white hover:bg-white/10"
      }`}
    >
      💻 Code
    </button>

  </div>

</div>

    {/* CONTENT */}
    <div className="flex-1 overflow-hidden relative">

  {/* EMPTY STATE */}
  {!files["index.html"] && (
    <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
      Start by typing a prompt →
    </div>
  )}

  {/* CONTENT */}
  {isGenerating && (
  <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-10">
    <div className="text-white/80 animate-pulse text-sm">
      ⚡ Generating your app...
    </div>
  </div>
)}
  {view === "preview" ? (
    <iframe className="w-full h-full bg-white rounded-xl shadow-2xl border border-white/10 transition-all duration-300 hover:scale-[1.005]"
  srcDoc={`
    <style>${files["style.css"] || ""}</style>
    ${files["index.html"] || ""}
    <script>${files["script.js"] || ""}</script>
  `}
/>
  ) : (
    <Editor
      files={files}
      activeFile={activeFile}
      onFileSelect={setActiveFile}
      onFileChange={(name, content) =>
        setFiles((prev) => ({ ...prev, [name]: content }))
      }
    />
  )}
</div>
  </div>


     

  {/* RIGHT SIDE → CHAT */}
  <div className="w-[380px] bg-white/[0.06] backdrop-blur-2xl border-l border-white/10 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.3)] hover:shadow-[-15px_0_50px_rgba(0,0,0,0.5)] transition-all duration-300">
   <div className="p-4 border-b border-white/10 flex items-center justify-between">
  <span className="text-white text-sm font-semibold tracking-wide">Kitty AI</span>
  <span className="text-[10px] text-emerald-400 animate-pulse">● Online</span>
</div>
    <div className="flex-1 overflow-hidden">
  <Chat
    messages={messages}
    isGenerating={isGenerating}
    onSendMessage={handleSendMessage}
  />
</div>
  </div>

</motion.div>

{showCommand && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
    <div className="w-[500px] bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
      <input
        autoFocus
        placeholder="Type a command or prompt..."
        className="w-full bg-transparent outline-none text-white placeholder:text-white/40"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage((e.target as HTMLInputElement).value);
            setShowCommand(false);
          }
        }}
      />
    </div>
  </div>
)}

        <CatAssistant isGenerating={isGenerating} />
      </main>
    </div>
  );
};
