export type UserRole = "employer" | "freelancer" | null;

export type MilestoneStatus = "pending" | "submitted" | "evaluating" | "passed" | "failed" | "paid";
export type EvaluationVerdict = "PASS" | "PARTIAL" | "FAIL" | null;

export interface EvaluationCheck {
  label: string;
  status: "pass" | "fail" | "warn";
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  deliverables: string[];
  deadline: string;
  status: MilestoneStatus;
  reward: number;
  repoUrl?: string;
  notes?: string;
  evaluation?: {
    verdict: EvaluationVerdict;
    confidenceScore: number;
    qualityScore: number;    // 0–100
    feedback: string;
    checks: EvaluationCheck[];
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: "draft" | "active" | "completed";
  createdAt: string;
  // Escrow wallet fields
  escrowLocked: number;
  escrowReleased: number;
  escrowRemaining: number;
}

export interface FreelancerStats {
  pfiScore: number;
  completedMilestones: number;
  failedMilestones: number;
  totalEarnings: number;
}

export interface Transaction {
  id: string;
  milestoneId: string;
  milestoneTitle: string;
  projectId: string;
  type: "payment" | "refund" | "bonus";
  amount: number;
  timestamp: string;
  verdict: EvaluationVerdict;
  confidenceScore: number;
}

export const initialProjects: Project[] = [];
export const initialMilestones: Milestone[] = [];
export const initialTransactions: Transaction[] = [];

export const initialFreelancerStats: FreelancerStats = {
  pfiScore: 740,          // starts at 500 + 12*20 = 740
  completedMilestones: 12,
  failedMilestones: 0,
  totalEarnings: 15400,
};
