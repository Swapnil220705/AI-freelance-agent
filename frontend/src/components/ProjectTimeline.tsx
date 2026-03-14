"use client";

import { motion, Variants } from "framer-motion";
import { Milestone } from "@/lib/mockData";
import { MilestoneCard } from "./MilestoneCard";

interface ProjectTimelineProps {
  milestones: Milestone[];
  onMilestoneClick?: (milestone: Milestone) => void;
  isFreelancerView?: boolean;
}

export function ProjectTimeline({ milestones, onMilestoneClick, isFreelancerView }: ProjectTimelineProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="relative pl-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-white/5 pb-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {milestones.map((milestone, index) => (
          <motion.div key={milestone.id} variants={item} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[30px] top-6 w-[10px] h-[10px] rounded-full bg-accent/50 border-2 border-panel shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            
            <MilestoneCard 
              milestone={milestone} 
              onClick={() => onMilestoneClick?.(milestone)}
              isFreelancerView={isFreelancerView}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
