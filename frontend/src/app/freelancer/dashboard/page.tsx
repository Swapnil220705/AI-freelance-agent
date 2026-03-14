"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { FreelancerStats } from "@/components/FreelancerStats";
import { MilestoneCard } from "@/components/MilestoneCard";
import { SubmissionModal } from "@/components/SubmissionModal";
import { AIProcessingAnimation } from "@/components/AIProcessingAnimation";
import { PaymentDecisionCard } from "@/components/PaymentDecisionCard";
import { Milestone } from "@/lib/mockData";
import { runPaymentDecision, EvaluationResult } from "@/lib/paymentAgent";
import { Terminal, Database, Activity } from "lucide-react";

// Simulate AI evaluation result — deterministic-ish based on quality keywords
function simulateEvaluation(repoUrl: string, notes: string, milestone: Milestone): EvaluationResult {
  const richNotes = notes.length > 60;
  const hasGithub = repoUrl.includes("github.com");
  const qualityScore = richNotes && hasGithub ? 94 : richNotes ? 82 : 68;
  const confidenceScore = qualityScore > 85 ? 0.96 : qualityScore > 70 ? 0.82 : 0.61;
  const verdict = qualityScore >= 90 ? "PASS" : qualityScore >= 70 ? "PASS" : "FAIL";

  return {
    verdict,
    qualityScore,
    confidenceScore,
    milestoneId: milestone.id,
    milestoneTitle: milestone.title,
    projectId: milestone.projectId,
    reward: milestone.reward,
  };
}

export default function FreelancerDashboard() {
  const { milestones, updateMilestone, releaseMilestonePayment, refundMilestone } = useAppStore();

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [pendingEvaluation, setPendingEvaluation] = useState<EvaluationResult | null>(null);
  const [paymentReleased, setPaymentReleased] = useState(false);

  const pendingMilestones = milestones.filter(
    (m) => m.status === "pending" || m.status === "submitted" || m.status === "evaluating"
  );

  const handleOpenSubmission = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsSubmitting(true);
  };

  const handleSubmission = (repoUrl: string, notes: string) => {
    setIsSubmitting(false);
    if (!selectedMilestone) return;

    // Store submission data
    updateMilestone(selectedMilestone.id, {
      status: "evaluating",
      repoUrl,
      notes,
    });

    // Pre-compute evaluation so it's ready when animation finishes
    const evalResult = simulateEvaluation(repoUrl, notes, selectedMilestone);
    setPendingEvaluation(evalResult);
    setIsEvaluating(true);
  };

  const handleEvaluationComplete = () => {
    setIsEvaluating(false);

    if (!pendingEvaluation || !selectedMilestone) return;

    // Attach evaluation to milestone with quality score + checks
    const ev = pendingEvaluation;
    updateMilestone(ev.milestoneId, {
      status: ev.verdict === "FAIL" ? "failed" : "passed",
      evaluation: {
        verdict: ev.verdict,
        confidenceScore: ev.confidenceScore,
        qualityScore: ev.qualityScore,
        feedback:
          ev.verdict === "PASS"
            ? "All deliverables verified. Repository structure matches requirements. Code passes quality gates."
            : "Submission did not fully meet milestone deliverables. Key components missing or incomplete.",
        checks: [
          { label: "Repository Access", status: "pass" },
          { label: "Deliverable Coverage", status: ev.verdict === "PASS" ? "pass" : "fail" },
          { label: "Code Quality", status: ev.qualityScore >= 80 ? "pass" : "warn" },
          { label: "Security Scan", status: "pass" },
        ],
      },
    });
  };

  const handleClaim = () => {
    if (!pendingEvaluation || !selectedMilestone) return;

    if (pendingEvaluation.verdict === "FAIL") {
      refundMilestone(pendingEvaluation);
    } else {
      releaseMilestonePayment(pendingEvaluation);
    }

    setPaymentReleased(true);

    setTimeout(() => {
      setPaymentReleased(false);
      setPendingEvaluation(null);
      setSelectedMilestone(null);
    }, 3500);
  };

  const decision = pendingEvaluation ? runPaymentDecision(pendingEvaluation) : null;
  const milestone = selectedMilestone;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full relative">
      <FreelancerStats />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 mb-2 text-[10px] font-mono tracking-widest uppercase text-secondary">
            <Activity size={12} className="animate-pulse" /> Freelancer Dashboard
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground uppercase tracking-tight">
            Available Work
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-border text-[10px] font-mono text-gray-400 uppercase tracking-widest hidden md:flex">
          <Database size={12} /> Synced
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Milestone List */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-6">
            Open Milestones
          </h2>
          {pendingMilestones.length === 0 ? (
            <div className="py-20 text-center border-2 border-border border-dashed font-mono text-xs text-gray-600 uppercase tracking-widest">
              No open milestones yet. Ask the employer to create a project first.
            </div>
          ) : (
            pendingMilestones.map((ms) => (
              <MilestoneCard
                key={ms.id}
                milestone={ms}
                isFreelancerView={true}
                onClick={() => ms.status === "pending" && handleOpenSubmission(ms)}
              />
            ))
          )}
        </div>

        {/* Right: Action Panel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!milestone ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[600px] border border-border bg-border/20 flex flex-col items-center justify-center p-8 text-center"
              >
                <Terminal size={48} className="text-border mb-6" />
                <p className="font-mono text-xs text-gray-600 uppercase tracking-widest">
                  Select a milestone to view details and submit your work
                </p>
              </motion.div>
            ) : isEvaluating ? (
              <motion.div
                key="evaluating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-2 border-accent/20 bg-border/20 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <AIProcessingAnimation
                  mode="evaluation"
                  onComplete={handleEvaluationComplete}
                />
              </motion.div>
            ) : pendingEvaluation && decision ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h2 className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                  Evaluation Complete
                </h2>

                <PaymentDecisionCard
                  decision={decision}
                  verdict={pendingEvaluation.verdict}
                  qualityScore={pendingEvaluation.qualityScore}
                  confidenceScore={pendingEvaluation.confidenceScore}
                  milestoneTitle={milestone.title}
                  reward={milestone.reward}
                />

                {!paymentReleased ? (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleClaim}
                    className={`w-full py-4 font-bold font-mono tracking-widest uppercase transition-colors text-sm ${
                      pendingEvaluation.verdict === "FAIL"
                        ? "bg-warning text-base hover:bg-yellow-300"
                        : "bg-success text-base hover:bg-emerald-300"
                    }`}
                  >
                    {pendingEvaluation.verdict === "FAIL"
                      ? `Acknowledge Refund — $${milestone.reward.toLocaleString()} returned`
                      : `Claim Payment — $${decision.totalAmount.toLocaleString()}`}
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`w-full py-4 border font-bold font-mono tracking-widest uppercase text-center text-sm ${
                      pendingEvaluation.verdict === "FAIL"
                        ? "border-warning bg-warning/10 text-warning"
                        : "border-success bg-success/10 text-success"
                    }`}
                  >
                    {pendingEvaluation.verdict === "FAIL"
                      ? "Refund Processed — Escrow Updated"
                      : "Funds Deposited — Transaction Logged"}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-6">
                  Selected Milestone
                </h2>
                <MilestoneCard milestone={milestone} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedMilestone && isSubmitting && (
          <SubmissionModal
            isOpen={isSubmitting}
            milestone={selectedMilestone}
            onClose={() => setIsSubmitting(false)}
            onSubmit={handleSubmission}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
