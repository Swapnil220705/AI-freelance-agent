"use client";

import { motion } from "framer-motion";
import { Milestone } from "@/lib/mockData";
import { StatusBadge } from "./StatusBadge";
import { Database, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface MilestoneCardProps {
  milestone: Milestone;
  onClick?: () => void;
  isFreelancerView?: boolean;
}

export function MilestoneCard({ milestone, onClick, isFreelancerView }: MilestoneCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 border border-border bg-panel hover:border-secondary transition-all cursor-pointer group relative"
      onClick={onClick}
    >
      {/* Brutalist Decoration */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent"></div>

      <div className="flex justify-between items-start mb-4">
        <h4 className="font-display text-xl font-bold text-foreground group-hover:text-secondary transition-colors max-w-[70%]">
          {milestone.title}
        </h4>
        <StatusBadge status={milestone.status} />
      </div>

      <p className="text-gray-400 text-sm mb-6 line-clamp-2 font-body max-w-[85%]">
        {milestone.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-border/50">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Requirements</span>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
            <Database size={12} className="text-accent" />
            {milestone.deliverables.length} NODES
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Deadline</span>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
            <Clock size={12} className="text-accent" />
            {format(new Date(milestone.deadline), "MM.dd.yy")}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between pt-4 border-t border-border mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Bounty Amount</span>
          <div className="text-success font-mono font-bold text-lg">
            ${milestone.reward.toLocaleString()}
          </div>
        </div>
        
        {isFreelancerView && milestone.status === "pending" && (
          <button className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase px-4 py-2 bg-accent text-base hover:bg-white transition-colors">
            Init Submit <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
