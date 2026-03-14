"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Milestone } from "@/lib/mockData";
import { X, Github, AlignLeft } from "lucide-react";
import { useState } from "react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (repoUrl: string, notes: string) => void;
  milestone: Milestone;
}

export function SubmissionModal({ isOpen, onClose, onSubmit, milestone }: SubmissionModalProps) {
  const [repoUrl, setRepoUrl] = useState("https://github.com/freelancer/orbitflow-milestone1");
  const [notes, setNotes] = useState("Completed all requirements. Implementation uses Next.js and Tailwind.");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-base/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-panel border gap-6 flex flex-col border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-display font-semibold text-white">Submit Work</h2>
                <p className="text-sm text-gray-400 mt-1">Milestone: {milestone.title}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-300">
                  <Github size={16} /> Repository URL
                </label>
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-300">
                  <AlignLeft size={16} /> Submission Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onSubmit(repoUrl, notes);
                  onClose();
                }}
                className="relative px-5 py-2.5 rounded-lg text-sm font-semibold bg-white text-base overflow-hidden group hover:scale-[1.02] transition-transform active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Submit to AI Review
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
