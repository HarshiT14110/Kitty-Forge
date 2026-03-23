import React from "react";
import { Plus, History, Layout, ChevronLeft, ChevronRight, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewProject: () => void;
  projects: { id: string; name: string; date: string }[];
  onProjectSelect: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onNewProject,
  projects,
  onProjectSelect,
}) => {
  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className="h-screen bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col relative z-50"
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Logo Area */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-bold text-xl shrink-0">
          K
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-xl font-creative font-extrabold text-white tracking-tighter"
            >
              Kitty Forge
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* New Project Button */}
      <div className="p-4">
        <button
          onClick={onNewProject}
          className={`w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] ${
            !isOpen && "p-3"
          }`}
        >
          <Plus size={20} />
          {isOpen && <span>New Project</span>}
        </button>
      </div>

      {/* Project History */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-hide">
        <div className={`flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest px-2 mb-2 ${!isOpen && "justify-center"}`}>
          <History size={14} />
          {isOpen && <span>History</span>}
        </div>
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onProjectSelect(project.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all group ${
              !isOpen && "justify-center"
            }`}
          >
            <Layout size={18} className="shrink-0 group-hover:text-emerald-400 transition-colors" />
            {isOpen && (
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-sm font-medium truncate w-full">{project.name}</span>
                <span className="text-[10px] text-white/30">{project.date}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
