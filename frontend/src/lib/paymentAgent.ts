import { EvaluationVerdict, Transaction } from "./mockData";

export interface EvaluationResult {
  verdict: EvaluationVerdict;
  confidenceScore: number; // 0-1
  qualityScore: number;    // 0-100
  milestoneId: string;
  milestoneTitle: string;
  projectId: string;
  reward: number;
}

export interface PaymentDecision {
  action: "payment" | "refund" | "bonus";
  baseAmount: number;
  bonusAmount: number;
  totalAmount: number;
  reason: string;
}

export function runPaymentDecision(evaluation: EvaluationResult): PaymentDecision {
  const { verdict, qualityScore, reward } = evaluation;

  if (verdict === "PASS") {
    const hasBonus = qualityScore > 90;
    const bonusAmount = hasBonus ? Math.round(reward * 0.05) : 0; // 5% bonus
    return {
      action: hasBonus ? "bonus" : "payment",
      baseAmount: reward,
      bonusAmount,
      totalAmount: reward + bonusAmount,
      reason: hasBonus
        ? `Exceptional quality score (${qualityScore}/100) — 5% bonus applied.`
        : `Work meets all milestone requirements. Payment released.`,
    };
  }

  if (verdict === "PARTIAL") {
    const partialAmount = Math.round(reward * 0.5);
    return {
      action: "payment",
      baseAmount: partialAmount,
      bonusAmount: 0,
      totalAmount: partialAmount,
      reason: `Partial completion detected. 50% payment released, remaining refunded to employer.`,
    };
  }

  // FAIL
  return {
    action: "refund",
    baseAmount: 0,
    bonusAmount: 0,
    totalAmount: reward,
    reason: `Submission did not meet milestone requirements. Full amount refunded to employer escrow.`,
  };
}

export function buildTransaction(
  decision: PaymentDecision,
  evaluation: EvaluationResult
): Transaction {
  return {
    id: `TXN_${Date.now()}`,
    milestoneId: evaluation.milestoneId,
    milestoneTitle: evaluation.milestoneTitle,
    projectId: evaluation.projectId,
    type: decision.action === "refund" ? "refund" : decision.action === "bonus" ? "bonus" : "payment",
    amount: decision.totalAmount,
    timestamp: new Date().toISOString(),
    verdict: evaluation.verdict,
    confidenceScore: evaluation.confidenceScore,
  };
}
