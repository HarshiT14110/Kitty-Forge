import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  Palette, 
  BarChart3, 
  Shield, 
  ChevronRight,
  Zap,
  Cpu,
  Globe,
  Lock,
  User,
  LogOut
} from 'lucide-react';
import { Home, Folder, Settings, Star, Plus } from "lucide-react";
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { auth, googleProvider } from './firebase';
import { BlurText } from './components/BlurText';
import { cn } from './lib/utils';


const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 18) return "Good Afternoon ⚡";
  return "Good Evening 🌙";
};
const Navbar = () => {
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && window.location.pathname === '/') {
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User:", result.user);
    } catch (err: any) {
      console.error("FULL ERROR:", err);

      // 🔥 SHOW REAL ERROR
      alert(err.message);

      // Optional: still show small UI error
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
      <div className="px-6 py-3 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-between gap-8 shadow-xl w-[90vw] max-w-[900px]">
        <div className="flex items-center justify-center gap-3 group relative px-3 py-1.5 rounded-2xl transition-all duration-500 hover:bg-white/5 backdrop-blur-[2px] col-start-2">
          {/* Amorphous Glow Effect */}
          <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="absolute -inset-2 bg-white/10 blur-xl rounded-full opacity-40 pointer-events-none" />
          
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden relative z-10">
            <img 
              src="/logo.png" 
              alt="Kitty Forge Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] transition-transform duration-500 group-hover:scale-110 animate-[pulse_4s_infinite]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/kitty-forge-logo/100/100";
              }}
            />
          </div>
          <span className="text-2xl font-creative font-extrabold text-white tracking-tighter relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]">
            Kitty Forge
          </span>
        </div>

        <div className="flex items-center gap-4 justify-end">
          {error && (
            <span className="text-red-400 text-[10px] uppercase tracking-wider animate-pulse">
              {error}
            </span>
          )}
          {user ? (
            <div className="flex items-center gap-4 justify-end">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white text-xs font-medium">
  {getGreeting()}, {user.displayName}
</span>
                <span className="text-white/40 text-[10px] uppercase tracking-wider">Active Forger</span>
              </div>
              <button 
                onClick={handleLogout}
                className="liquid-glass rounded-full p-2 text-white/70 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
                <img src={user.photoURL || ''} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="liquid-glass-strong rounded-full px-6 py-2.5 text-white text-sm font-medium flex items-center gap-2 hover:scale-105 transition-all border border-white/10"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleCreate = () => {
    if (user) {
      navigate("/dashboard", { state: { initialPrompt: prompt } });
    } else {
      signInWithPopup(auth, googleProvider).catch((err) => {
  console.error("Hero Login Error:", err);
  alert(err.message);
});
    }
  };

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Hero Background Image - Full Screen & Crystal Clear */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.png" 
          alt="Kitty Forge Hero Background" 
          className="w-full h-full object-cover opacity-100 transition-opacity duration-1000"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/forge-dark/1920/1080?grayscale";
          }}
        />
        {/* Fallback video if image is missing */}
        
      </div>
      
      {/* Minimal Overlays - Stronger bottom gradient for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black z-[1]" />

      {/* Sleek Floating Input Line - Positioned "one inch" (approx 96px) from edges */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[70%] max-w-[900px] z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="liquid-glass-strong rounded-full p-2 pl-8 flex items-center gap-4 border border-white/10 shadow-2xl backdrop-blur-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
        >
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Share Your Idea..."
            className="flex-1 bg-transparent border-none text-white font-body text-lg focus:outline-none placeholder:text-white/20"
          />
          <button 
            onClick={handleCreate}
            className="bg-white text-black px-10 py-4 rounded-full font-medium transition-all hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] whitespace-nowrap"
          >
            Create
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const Inspiration = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleIdeaClick = (idea: string) => {
    if (user) {
      navigate("/dashboard", { state: { initialPrompt: idea } });
    } else {
      signInWithPopup(auth, googleProvider).catch((err) => {
  console.error("Inspiration Login Error:", err);
  alert(err.message);
});
    }
  };

  return (
    <section className="relative py-32 px-6 bg-black overflow-hidden">
      {/* Color Grading / Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
        <div className="section-badge mb-4">Inspiration</div>
        <h2 className="section-heading">What will you forge today?</h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Build a scientific calculator",
            "Create a personal portfolio",
            "Design a fitness tracker",
            "Forge a custom e-commerce store",
            "Develop a weather dashboard",
            "Build a task management system"
          ].map((idea, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleIdeaClick(idea)}
              className="liquid-glass rounded-2xl p-8 border border-white/5 hover:border-white/20 transition-all group flex items-center justify-between cursor-pointer"
            >
              <span className="text-white/70 font-body text-lg group-hover:text-white transition-colors">{idea}</span>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

const LandingPage = () => {
  return (
    <main className="bg-transparent min-h-screen selection:bg-white selection:text-black overflow-x-hidden relative cursor-default">
      {/* Global Continuity Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex">
  
  {/* LEFT SIDEBAR - HISTORY */}
  <div className="absolute left-0 top-0 h-full w-[10px]"></div>
 <div className="group relative w-[60px] hover:w-[220px] hover:w-[220px] h-screen bg-white/[0.05] backdrop-blur-xl border-r border-white/10 p-2 hidden md:flex flex-col transition-all duration-300 ease-in-out hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]">

  {/* TOP LOGO */}
  <div className="flex flex-col items-center gap-4 mb-6">

  {/* MAIN ICON */}
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg">
    <span className="text-black font-bold">K</span>
  </div>

  {/* MINI LINE */}
  <div className="w-6 h-[2px] bg-white/20 rounded-full group-hover:opacity-0 transition-all"></div>

</div>

  {/* NEW PROJECT BUTTON */}
  <button className="h-10 w-10 mx-auto bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-md hover:scale-110 transition-all group-hover:w-auto group-hover:px-3 group-hover:justify-start gap-2">

  <Plus className="w-4 h-4 text-black" />

  <span className="opacity-0 group-hover:opacity-100 text-black text-sm whitespace-nowrap">
    New
  </span>

</button>

  {/* HISTORY */}
  <div className="flex-1">
    <p className="text-white/40 text-xs mb-2 opacity-0 group-hover:opacity-100">
      HISTORY
    </p>

    <div className="space-y-2">
      <div className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 cursor-pointer flex items-center justify-center group-hover:justify-start gap-3 transition-all hover:border border-white/10">
        <Folder className="w-4 h-4 text-white/70" />
        <div className="opacity-0 group-hover:opacity-100 transition-all">
          <p className="text-white text-sm">My First App</p>
          <span className="text-xs text-white/40">2026-03-22</span>
        </div>
      </div>
    </div>
  </div>

  {/* BOTTOM SECTION */}
  <div className="space-y-3">
    <div className="flex items-center justify-center group-hover:justify-start gap-3 text-white/60 hover:text-white cursor-pointer transition-all">

  <Settings className="w-4 h-4" />

  <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap">
    Settings
  </span>

</div>

    <div className="flex items-center justify-center group-hover:justify-start gap-3 text-white/60 hover:text-white cursor-pointer transition-all">

  <Star className="w-4 h-4" />
  <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap">
    Upgrade
  </span>

</div>
  </div>
</div>

  {/* MAIN CONTENT */}
  <div className="flex-1 transition-all duration-300">
  <Navbar />
  <Hero />
    <Inspiration />
  </div>

</div>
    </main>
  );
};
