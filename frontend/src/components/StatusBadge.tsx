import { cn } from "@/lib/utils";
import { MilestoneStatus } from "@/lib/mockData";
import { CopyCheck, Loader2, Sparkles, AlertCircle, CheckCircle2, DollarSign } from "lucide-react";

interface StatusBadgeProps {
  status: MilestoneStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      icon: Loader2,
      label: "Pending",
      animate: false
    },
    submitted: {
      color: "bg-secondary/10 text-secondary border-secondary/20",
      icon: Sparkles,
      label: "AI Analyzing",
      animate: true
    },
    evaluating: {
      color: "bg-warning/10 text-warning border-warning/20",
      icon: AlertCircle,
      label: "Evaluating",
      animate: true
    },
    passed: {
      color: "bg-success/10 text-success border-success/20",
      icon: CheckCircle2,
      label: "Passed",
      animate: false
    },
    failed: {
      color: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: AlertCircle,
      label: "Revision Required",
      animate: false
    },
    paid: {
      color: "bg-accent/10 text-accent border-accent/20",
      icon: DollarSign,
      label: "Paid",
      animate: false
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
      config.color,
      className
    )}>
      <Icon size={12} className={cn(config.animate && "animate-spin-slow")} />
      {config.label}
    </span>
  );
}
