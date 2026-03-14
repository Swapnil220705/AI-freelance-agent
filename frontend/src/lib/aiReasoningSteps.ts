export interface AIStep {
  id: string;
  label: string;
  duration: number; // ms
}

export const AI_EVALUATION_STEPS: AIStep[] = [
  { id: "connect",    label: "Connecting to AI evaluation engine",          duration: 600 },
  { id: "repo",       label: "Fetching repository structure",               duration: 800 },
  { id: "syntax",     label: "Running static analysis & syntax checks",     duration: 900 },
  { id: "deliv",      label: "Comparing deliverables with requirements",    duration: 1000 },
  { id: "quality",    label: "Computing code quality score",                duration: 800 },
  { id: "confidence", label: "Generating confidence score",                 duration: 600 },
  { id: "decision",   label: "Making financial decision",                   duration: 700 },
];

export const AI_GENERATION_STEPS: AIStep[] = [
  { id: "parse",    label: "Parsing project description",           duration: 700 },
  { id: "scope",    label: "Scoping deliverables & complexity",     duration: 900 },
  { id: "split",    label: "Splitting into milestone phases",       duration: 1000 },
  { id: "budget",   label: "Allocating budget per milestone",       duration: 800 },
  { id: "deadline", label: "Estimating deadlines",                  duration: 700 },
  { id: "finalize", label: "Finalizing escrow parameters",          duration: 600 },
];
