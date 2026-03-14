import { create } from "zustand";
import { 
  UserRole, 
  Project, 
  Milestone, 
  FreelancerStats,
  Transaction,
  initialProjects, 
  initialMilestones, 
  initialFreelancerStats,
  initialTransactions,
} from "./mockData";
import { runPaymentDecision, buildTransaction, EvaluationResult } from "./paymentAgent";
import { calculatePFI } from "./pfiCalculator";

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;

  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;

  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
  addMilestone: (milestone: Milestone) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;

  stats: FreelancerStats;
  updateStats: (updates: Partial<FreelancerStats>) => void;

  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  clearTransactions: () => void;

  // High-level workflow actions
  releaseMilestonePayment: (evaluation: EvaluationResult) => void;
  refundMilestone: (evaluation: EvaluationResult) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  role: null,
  setRole: (role) => set({ role }),

  projects: initialProjects,
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  milestones: initialMilestones,
  setMilestones: (milestones) => set({ milestones }),
  addMilestone: (milestone) => set((state) => ({ milestones: [...state.milestones, milestone] })),
  updateMilestone: (id, updates) =>
    set((state) => ({
      milestones: state.milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  stats: initialFreelancerStats,
  updateStats: (updates) => set((state) => ({ stats: { ...state.stats, ...updates } })),

  transactions: initialTransactions,
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
  clearTransactions: () => set({ transactions: [] }),

  releaseMilestonePayment: (evaluation) => {
    const { updateMilestone, updateProject, updateStats, addTransaction } = get();
    const decision = runPaymentDecision(evaluation);
    const tx = buildTransaction(decision, evaluation);

    // Update milestone status
    updateMilestone(evaluation.milestoneId, { status: "paid" });

    // Update project escrow
    updateProject(evaluation.projectId, ((): Partial<Project> => {
      const project = get().projects.find(p => p.id === evaluation.projectId);
      if (!project) return {};
      return {
        escrowReleased: project.escrowReleased + decision.totalAmount,
        escrowRemaining: project.escrowRemaining - decision.totalAmount,
      };
    })());

    // Update freelancer PFI stats
    const currentStats = get().stats;
    const newCompleted = currentStats.completedMilestones + 1;
    const newFailed = currentStats.failedMilestones;
    updateStats({
      completedMilestones: newCompleted,
      totalEarnings: currentStats.totalEarnings + decision.totalAmount,
      pfiScore: calculatePFI(newCompleted, newFailed),
    });

    // Record transaction
    addTransaction(tx);
  },

  refundMilestone: (evaluation) => {
    const { updateMilestone, updateProject, updateStats, addTransaction } = get();
    const decision = runPaymentDecision(evaluation);
    const tx = buildTransaction(decision, evaluation);

    // Update milestone to failed
    updateMilestone(evaluation.milestoneId, { status: "failed" });

    // Return funds to escrow remaining (unlock)
    updateProject(evaluation.projectId, ((): Partial<Project> => {
      const project = get().projects.find(p => p.id === evaluation.projectId);
      if (!project) return {};
      return {
        escrowLocked: project.escrowLocked - evaluation.reward,
        escrowRemaining: project.escrowRemaining, // stays the same (wasn't released)
      };
    })());

    // Update freelancer failed count + recalc PFI
    const currentStats = get().stats;
    const newCompleted = currentStats.completedMilestones;
    const newFailed = currentStats.failedMilestones + 1;
    updateStats({
      failedMilestones: newFailed,
      pfiScore: calculatePFI(newCompleted, newFailed),
    });

    // Record refund transaction
    addTransaction(tx);
  },
}));
