"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { AIProcessingAnimation } from "@/components/AIProcessingAnimation";
import { ProjectTimeline } from "@/components/ProjectTimeline";
import { ProjectCard } from "@/components/ProjectCard";
import { EscrowPanel } from "@/components/EscrowPanel";
import { TransactionLedger } from "@/components/TransactionLedger";
import { Plus, Terminal, Activity, ChevronDown, ChevronRight } from "lucide-react";
import { Milestone, Project } from "@/lib/mockData";

export default function EmployerDashboard() {
  const { projects, milestones, addProject, setMilestones } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLedger, setShowLedger] = useState(false);

  const [title, setTitle] = useState("Microservices Re-Architecture");
  const [desc, setDesc] = useState("Break apart a monolithic legacy codebase into modern microservices.");
  const [budget, setBudget] = useState("25000");

  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects[0]?.id || null);

  const handleGenerate = () => {
    setIsGenerating(true);
  };

  const handleAIComplete = () => {
    setIsGenerating(false);
    setIsCreating(false);

    const budgetNum = parseInt(budget);

    const newProject: Project = {
      id: `PRJ_${Date.now()}`,
      title,
      description: desc,
      budget: budgetNum,
      status: "active",
      createdAt: new Date().toISOString(),
      // Initialize escrow wallet
      escrowLocked: budgetNum,
      escrowReleased: 0,
      escrowRemaining: budgetNum,
    };

    const newMilestones: Milestone[] = [
      {
        id: `MS_${Date.now()}_1`,
        projectId: newProject.id,
        title: "Project Setup",
        description: "Set up the primary services, configure the database, and establish authentication.",
        deliverables: ["API Gateway", "DB Migrations", "Auth Service"],
        deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: "pending",
        reward: Math.round(budgetNum * 0.2),
      },
      {
        id: `MS_${Date.now()}_2`,
        projectId: newProject.id,
        title: "Service Migration",
        description: "Migrate the legacy payment system to the new microservices architecture.",
        deliverables: ["Event Bus", "Payment Worker", "Audit Log"],
        deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
        status: "pending",
        reward: Math.round(budgetNum * 0.48),
      },
      {
        id: `MS_${Date.now()}_3`,
        projectId: newProject.id,
        title: "Go Live",
        description: "Switch live traffic over to the new system and decommission old endpoints.",
        deliverables: ["DNS Cutover", "Monitoring Dashboard", "Documentation"],
        deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
        status: "pending",
        reward: Math.round(budgetNum * 0.32),
      },
    ];

    addProject(newProject);
    setMilestones([...milestones, ...newMilestones]);
    setActiveProjectId(newProject.id);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const activeMilestones = activeProject
    ? milestones.filter((m) => m.projectId === activeProject.id)
    : [];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-mono tracking-widest uppercase text-accent">
            <Activity size={14} className="animate-pulse" />
            Employer Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground uppercase tracking-tight">
            My Projects
          </h1>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="group flex items-center gap-3 px-6 py-3 bg-accent text-base border-2 border-accent hover:bg-transparent hover:text-accent font-mono text-xs uppercase tracking-widest transition-all"
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[600px] border-2 border-accent/20 bg-border/20 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] pointer-events-none" />
            <AIProcessingAnimation mode="generation" onComplete={handleAIComplete} />
          </motion.div>
        ) : isCreating ? (
          <motion.div
            key="creating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl border border-border bg-panel p-10 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
              <Terminal className="text-accent" size={24} />
              <h2 className="text-2xl font-display font-bold text-foreground">Create New Project</h2>
            </div>

            <div className="space-y-6 relative font-mono text-sm">
              <div>
                <label className="text-gray-500 mb-2 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                  <span className="text-accent">{"> "}</span> Project Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-base border border-border px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-2 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                  <span className="text-accent">{"> "}</span> Description
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  className="w-full bg-base border border-border px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-2 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                  <span className="text-accent">{"> "}</span> Total Budget (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-base border border-border pl-8 pr-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-[10px] text-gray-600 font-mono mt-2 uppercase tracking-widest">
                  Full amount will be locked in escrow on project creation
                </p>
              </div>

              <div className="flex gap-4 pt-8">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 border border-border text-gray-400 hover:text-foreground hover:bg-border transition-colors uppercase tracking-widest text-xs"
                >
                  <span className="text-secondary">{"> "}</span> Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 px-6 py-3 bg-foreground text-base hover:bg-gray-300 transition-colors flex items-center justify-center gap-3 uppercase tracking-widest text-xs font-bold group"
                >
                  <Terminal size={16} /> Generate Milestones with AI
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {/* Main 2-column layout */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-10">
              {/* Timeline */}
              <div>
                <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
                  <h2 className="text-xl font-display font-bold text-foreground">Project Timeline</h2>
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                    {activeMilestones.length} Milestones
                  </span>
                </div>
                {activeMilestones.length > 0 ? (
                  <ProjectTimeline milestones={activeMilestones} />
                ) : (
                  <div className="text-gray-600 py-16 text-center border-2 border-border border-dashed font-mono uppercase tracking-widest text-xs">
                    No projects yet. Create your first project to get started.
                  </div>
                )}
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                <h2 className="text-xl font-display font-bold text-foreground border-b border-border/50 pb-4">
                  Active Project
                </h2>
                {activeProject ? (
                  <>
                    <ProjectCard project={activeProject} />
                    <EscrowPanel projectId={activeProject.id} />
                  </>
                ) : (
                  <div className="h-64 border border-border bg-border/20" />
                )}
              </div>
            </div>

            {/* Transaction Ledger — collapsible */}
            {activeProject && (
              <div>
                <button
                  onClick={() => setShowLedger((v) => !v)}
                  className="flex items-center gap-3 mb-4 text-sm font-display font-bold text-foreground hover:text-accent transition-colors uppercase tracking-wide"
                >
                  {showLedger ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  Transaction Ledger
                </button>
                <AnimatePresence>
                  {showLedger && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <TransactionLedger />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
