"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { AIStep, AI_EVALUATION_STEPS, AI_GENERATION_STEPS } from "@/lib/aiReasoningSteps";

interface AIProcessingAnimationProps {
  onComplete: () => void;
  mode?: "evaluation" | "generation";
}

export function AIProcessingAnimation({ onComplete, mode = "generation" }: AIProcessingAnimationProps) {
  const steps: AIStep[] = mode === "evaluation" ? AI_EVALUATION_STEPS : AI_GENERATION_STEPS;
  const [currentStep, setCurrentStep] = useState(-1);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    let stepIndex = 0;
    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);

    const advance = () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setCurrentStep(stepIndex);
        
        setTimeout(() => {
          setCompleted((prev) => [...prev, step.id]);
          stepIndex++;
          advance();
        }, step.duration);
      } else {
        setTimeout(onComplete, 400);
      }
    };

    const startDelay = setTimeout(advance, 300);
    return () => clearTimeout(startDelay);
  }, [onComplete]);

  const progress = steps.length > 0
    ? Math.round(((completed.length) / steps.length) * 100)
    : 0;

  return (
    <div className="flex flex-col items-center justify-center p-10 w-full max-w-lg relative z-10">
      {/* Spinning indicator */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-2 border-accent border-t-transparent mb-8 flex items-center justify-center"
      >
        <div className="w-6 h-6 bg-accent/20 border border-accent/50" />
      </motion.div>

      <h3 className="text-lg font-display font-bold text-foreground mb-1 uppercase tracking-widest text-center">
        {mode === "evaluation" ? "AI Evaluating Submission" : "AI Generating Milestones"}
      </h3>
      <p className="text-xs font-mono text-gray-500 mb-8 uppercase tracking-widest">
        {mode === "evaluation" ? "Do not close — evaluation in progress" : "Building your project structure"}
      </p>

      {/* Steps list */}
      <div className="w-full space-y-2 mb-8">
        {steps.map((step, i) => {
          const isDone = completed.includes(step.id);
          const isActive = currentStep === i && !isDone;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.35, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-all ${
                isDone ? "border-success bg-success/10" :
                isActive ? "border-accent bg-accent/10" :
                "border-border bg-transparent"
              }`}>
                {isDone ? (
                  <Check size={10} className="text-success" />
                ) : isActive ? (
                  <Loader2 size={10} className="text-accent animate-spin" />
                ) : null}
              </div>
              <span className={`text-xs font-mono transition-colors ${
                isDone ? "text-gray-500 line-through" :
                isActive ? "text-foreground font-semibold" :
                "text-gray-600"
              }`}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
          <span>Progress</span>
          <span className="text-accent">{progress}%</span>
        </div>
        <div className="w-full h-1 bg-border relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
