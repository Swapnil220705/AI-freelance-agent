"use client";

import { motion } from "framer-motion";
import { PaymentDecision } from "@/lib/paymentAgent";
import { EvaluationVerdict } from "@/lib/mockData";
import { CheckCircle2, XCircle, Zap, TrendingUp, ShieldCheck } from "lucide-react";

interface PaymentDecisionCardProps {
  decision: PaymentDecision;
  verdict: EvaluationVerdict;
  qualityScore: number;
  confidenceScore: number; // 0-1
  milestoneTitle: string;
  reward: number;
}

export function PaymentDecisionCard({
  decision,
  verdict,
  qualityScore,
  confidenceScore,
  milestoneTitle,
  reward,
}: PaymentDecisionCardProps) {
  const isPass = verdict === "PASS" || verdict === "PARTIAL";
  const hasBonus = decision.action === "bonus";

  const verdictConfig = {
    PASS: {
      icon: CheckCircle2,
      color: "text-success",
      border: "border-success/30",
      bg: "bg-success/5",
      label: hasBonus ? "Payment + Bonus" : "Payment Released",
      badgeColor: "bg-success/10 text-success border-success/30",
    },
    PARTIAL: {
      icon: CheckCircle2,
      color: "text-warning",
      border: "border-warning/30",
      bg: "bg-warning/5",
      label: "Partial Payment",
      badgeColor: "bg-warning/10 text-warning border-warning/30",
    },
    FAIL: {
      icon: XCircle,
      color: "text-red-500",
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      label: "Refund Issued",
      badgeColor: "bg-red-500/10 text-red-500 border-red-500/30",
    },
    null: {
      icon: ShieldCheck,
      color: "text-gray-500",
      border: "border-border",
      bg: "bg-border/20",
      label: "Pending",
      badgeColor: "bg-gray-500/10 text-gray-500 border-gray-500/30",
    },
  };

  const cfg = verdictConfig[verdict ?? "null"];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border ${cfg.border} ${cfg.bg} p-6`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 border ${cfg.border} flex items-center justify-center`}>
            <Icon size={20} className={cfg.color} />
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-0.5">
              Payment Agent Decision
            </p>
            <h4 className="font-display font-bold text-foreground">{milestoneTitle}</h4>
          </div>
        </div>
        <span className={`px-3 py-1 border text-[10px] font-mono font-bold uppercase tracking-widest ${cfg.badgeColor}`}>
          {verdict}
        </span>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="border border-border bg-base p-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
            Quality Score
          </p>
          <div className="flex items-end gap-1">
            <span className={`text-2xl font-mono font-bold ${cfg.color}`}>{qualityScore}</span>
            <span className="text-xs text-gray-500 font-mono mb-0.5">/100</span>
          </div>
        </div>
        <div className="border border-border bg-base p-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
            Confidence
          </p>
          <span className="text-2xl font-mono font-bold text-secondary">
            {Math.round(confidenceScore * 100)}%
          </span>
        </div>
        <div className="border border-border bg-base p-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
            Milestone Value
          </p>
          <span className="text-2xl font-mono font-bold text-foreground">
            ${reward.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Decision Summary */}
      <div className="border border-border bg-base p-4 mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
          {">"} Agent Reasoning
        </p>
        <p className="text-sm font-mono text-gray-300 leading-relaxed">{decision.reason}</p>
      </div>

      {/* Amount Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-gray-500 uppercase tracking-widest">Base Amount</span>
          <span className="text-foreground">${decision.baseAmount.toLocaleString()}</span>
        </div>
        {hasBonus && (
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-secondary uppercase tracking-widest flex items-center gap-1">
              <Zap size={10} /> Quality Bonus
            </span>
            <span className="text-secondary">+${decision.bonusAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <span className={`text-sm font-mono font-bold uppercase tracking-widest ${cfg.color}`}>
            {cfg.label}
          </span>
          <span className={`text-xl font-mono font-bold ${cfg.color}`}>
            {isPass ? "+" : "-"}${decision.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
