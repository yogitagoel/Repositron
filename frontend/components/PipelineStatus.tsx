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
  runId,
  onComplete,
}: {
  mode: "analyze" | "analyze-setup";
  runId: string;
  onComplete: () => void;
})
{
  const steps =
    mode === "analyze" ? analyzeOnlySteps : analyzeAndSetupSteps;

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch(`/api/pipeline/status?runId=${runId}`);
    const data = await res.json();

    if (data.status === "completed") {
      onComplete();
      clearInterval(interval);
      return;
    }

    if (data.currentStep !== undefined) {
      setCurrentStep(data.currentStep);
    }
  }, 2000);

  return () => clearInterval(interval);
}, [runId, onComplete]);


  return (
    <div className="mt-8 w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">
        {mode === "analyze"
          ? "Repository Analysis Pipeline"
          : "Analysis + Setup Pipeline"}
      </h2>

      <ul className="space-y-3 text-sm">
  {steps.map((step, index) => {
    const isDone = index < currentStep;
    const isActive = index === currentStep;

    return (
      <li
        key={step}
        className={`flex items-center gap-3 ${
          isDone
            ? "text-green-400"
            : isActive
            ? "text-blue-400 animate-pulse"
            : "text-gray-500"
        }`}
      >
        <span className="text-lg">
          {isDone ? "✔" : isActive ? "⟳" : "○"}
        </span>
        <span>{step}</span>
      </li>
    );
  })}
</ul>

    </div>
  );
}
