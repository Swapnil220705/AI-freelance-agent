"use client";

import { motion } from "framer-motion";
import { Project } from "@/lib/mockData";
import { format } from "date-fns";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 border border-border bg-panel hover:border-accent transition-colors group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-2 bg-border text-[10px] font-mono text-gray-400 group-hover:bg-accent group-hover:text-base transition-colors">
        ID:{project.id.split('_').pop()}
      </div>
      
      <div className="flex justify-between items-start mb-6 mt-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">{project.title}</h3>
          <span className="text-[11px] text-gray-500 font-mono uppercase tracking-widest">
            TGT_DATE // {format(new Date(project.createdAt), "MM.dd.yyyy")}
          </span>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm leading-relaxed mb-8 font-body">
        {project.description}
      </p>

      <div className="flex items-end justify-between border-t border-border pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Status</span>
          <span className="text-xs font-mono text-secondary uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-secondary"></div>
            {project.status}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Allocated Budget</span>
          <span className="text-xl font-mono text-foreground font-bold">
            ${project.budget.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
