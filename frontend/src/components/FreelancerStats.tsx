"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { TrendingUp, Target, ShieldAlert, DollarSign } from "lucide-react";

export function FreelancerStats() {
  const { stats } = useAppStore();

  const metrics = [
    { label: "PFI Score", value: stats.pfiScore.toFixed(1), icon: TrendingUp, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
    { label: "Completed", value: stats.completedMilestones, icon: Target, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { label: "Issues", value: stats.failedMilestones, icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    { label: "Earnings", value: `$${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl border ${m.border} bg-panel flex flex-col items-start gap-4 hover:bg-white/[0.02] transition-colors`}
          >
            <div className={`p-2 rounded-xl ${m.bg}`}>
              <Icon size={20} className={m.color} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{m.label}</p>
              <h3 className="font-display text-2xl font-bold text-white">{m.value}</h3>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
