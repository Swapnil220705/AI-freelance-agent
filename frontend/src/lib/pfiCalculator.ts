/**
 * PFI (Performance & Financial Integrity) Score
 * Formula: 500 + (completed * 20) - (failed * 10)
 * Clamped to [300, 900]
 */
export function calculatePFI(completed: number, failed: number): number {
  const raw = 500 + completed * 20 - failed * 10;
  return Math.min(900, Math.max(300, raw));
}

export function getPFILabel(score: number): string {
  if (score >= 800) return "Elite";
  if (score >= 650) return "Trusted";
  if (score >= 500) return "Active";
  if (score >= 400) return "Probation";
  return "Suspended";
}

export function getPFIColor(score: number): string {
  if (score >= 800) return "text-success";
  if (score >= 600) return "text-secondary";
  if (score >= 450) return "text-warning";
  return "text-red-500";
}
