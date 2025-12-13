"use client";

import { useEffect, useState } from "react";

// 🔹 Kestra-only
const analyzeOnlySteps = [
  "Cloning repository",
  "Analyzing architecture",
  "Generating repository summary",
];

// 🔹 Kestra + Cline
const analyzeAndSetupSteps = [
  "Cloning repository",
  "Analyzing architecture",
  "Generating repository summary",
  "Detecting project stack",
  "Installing dependencies",
  "Generating environment files",
  "Creating setup guide",
];

export default function PipelineStatus({
  mode,
  onComplete,
}: {
  mode: "analyze" | "analyze-setup";
  onComplete: () => void;
}) {
  const steps =
    mode === "analyze" ? analyzeOnlySteps : analyzeAndSetupSteps;

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="mt-8 w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">
        {mode === "analyze"
          ? "Repository Analysis Pipeline"
          : "Analysis + Setup Pipeline"}
      </h2>

      <ul className="space-y-2 text-sm">
        {steps.map((step, index) => {
          let icon = "○";
          let color = "text-gray-500";

          if (index < currentStep) {
            icon = "✔";
            color = "text-green-400";
          } else if (index === currentStep) {
            icon = "⟳";
            color = "text-yellow-400";
          }

          return (
            <li key={step} className={`flex gap-2 ${color}`}>
              <span>{icon}</span>
              <span>{step}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
