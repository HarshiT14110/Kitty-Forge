import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CatAssistantProps {
  isGenerating: boolean;
}

export const CatAssistant: React.FC<CatAssistantProps> = ({ isGenerating }) => {
  const [message, setMessage] = useState("🐱 Building your app...");

  useEffect(() => {
    if (isGenerating) {
      const messages = [
        "🐱 Sharpening my claws...",
        "🐱 Writing clean code...",
        "🐱 Purr-fecting the UI...",
        "🐱 Chasing bugs away...",
        "🐱 Almost there, meow!",
      ];
      let i = 0;
      const interval = setInterval(() => {
        setMessage(messages[i % messages.length]);
        i++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl"
        >
          <div className="relative w-16 h-16">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-5xl"
            >
              🐱
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full blur-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium text-sm">
              {message}
            </span>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-1.5 h-1.5 bg-white/50 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
