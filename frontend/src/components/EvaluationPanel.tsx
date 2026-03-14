"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Milestone } from "@/lib/mockData";
import { BrainCircuit, CheckCircle2, AlertTriangle, XCircle, Search, FileCode2, ShieldCheck } from "lucide-react";

interface EvaluationPanelProps {
  milestone: Milestone;
}

export function EvaluationPanel({ milestone }: EvaluationPanelProps) {
  if (!milestone.evaluation) return null;

  const { verdict, confidenceScore, feedback } = milestone.evaluation;

  const getVerdictConfig = (v: typeof verdict) => {
    switch(v) {
      case "PASS": return { color: "text-success", bg: "bg-success/10", border: "border-success/30", icon: CheckCircle2, shadow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]" };
      case "PARTIAL": return { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", icon: AlertTriangle, shadow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]" };
      case "FAIL": return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle, shadow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]" };
      default: return { color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/30", icon: BrainCircuit, shadow: "" };
    }
  };

  const config = getVerdictConfig(verdict);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`relative mt-4 p-5 rounded-xl border ${config.border} ${config.bg} backdrop-blur-md overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-10 ${config.bg}`} />

      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${config.bg} ${config.shadow}`}>
          <Icon size={24} className={config.color} />
        </div>
        <div>
          <h5 className="font-display font-semibold text-white tracking-wide">AI Evaluation Verdict</h5>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase border ${config.border} ${config.color}`}>
              {verdict}
            </span>
            <span className="text-xs text-gray-400 font-mono text-[10px]">
              Confidence: {(confidenceScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Verification Checks Simulation */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-300 bg-black/20 px-2 py-1.5 rounded">
            <Search size={14} className="text-accent" /> Repo Scanned
          </div>
          <div className="flex items-center gap-1.5 text-gray-300 bg-black/20 px-2 py-1.5 rounded">
            <FileCode2 size={14} className="text-secondary" /> Syntax Checked
          </div>
          <div className="flex items-center gap-1.5 text-gray-300 bg-black/20 px-2 py-1.5 rounded">
            <ShieldCheck size={14} className={verdict === "PASS" ? "text-success" : "text-warning"} /> Req Verified
          </div>
        </div>

        <div className="bg-black/30 p-3 rounded-lg border border-white/5">
          <p className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-line">
             <span className="text-accent">{"> "}</span>
             {feedback}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
