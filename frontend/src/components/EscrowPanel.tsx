"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Lock, Unlock, DollarSign, BarChart3 } from "lucide-react";

interface EscrowPanelProps {
  projectId: string;
}

export function EscrowPanel({ projectId }: EscrowPanelProps) {
  const { projects } = useAppStore();
  const project = projects.find((p) => p.id === projectId);

  if (!project) return null;

  const { budget, escrowLocked, escrowReleased, escrowRemaining } = project;
  const percentReleased = budget > 0 ? (escrowReleased / budget) * 100 : 0;

  const metrics = [
    {
      label: "Total Budget",
      value: `$${budget.toLocaleString()}`,
      icon: DollarSign,
      color: "text-foreground",
      border: "border-border",
      bg: "bg-border/30",
    },
    {
      label: "Locked in Escrow",
      value: `$${escrowLocked.toLocaleString()}`,
      icon: Lock,
      color: "text-accent",
      border: "border-accent/20",
      bg: "bg-accent/5",
    },
    {
      label: "Released",
      value: `$${escrowReleased.toLocaleString()}`,
      icon: Unlock,
      color: "text-success",
      border: "border-success/20",
      bg: "bg-success/5",
    },
    {
      label: "Remaining",
      value: `$${escrowRemaining.toLocaleString()}`,
      icon: BarChart3,
      color: "text-secondary",
      border: "border-secondary/20",
      bg: "bg-secondary/5",
    },
  ];

  return (
    <div className="border border-border bg-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-1">
            Escrow Wallet
          </p>
          <h3 className="text-lg font-display font-bold text-foreground">Budget Overview</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 border border-accent/20 bg-accent/5 text-[10px] font-mono text-accent uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-accent animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`p-4 border ${m.border} ${m.bg} flex flex-col gap-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                  {m.label}
                </span>
                <Icon size={14} className={m.color} />
              </div>
              <span className={`text-xl font-mono font-bold ${m.color}`}>{m.value}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Release Progress Bar */}
      <div>
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
          <span>Released</span>
          <span className="text-success">{percentReleased.toFixed(1)}%</span>
        </div>
        <div className="w-full h-1.5 bg-border relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-success"
            initial={{ width: "0%" }}
            animate={{ width: `${percentReleased}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
