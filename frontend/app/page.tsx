"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PipelineStatus from "../components/PipelineStatus";
import { motion } from "framer-motion";
import WaveBackground from "../components/WaveBackgound";

type PipelineState = "idle" | "running" | "completed";
type Mode = "analyze" | "analyze-setup" | null;

export default function Home() {
  const [pipelineState, setPipelineState] =
    useState<PipelineState>("idle");
  const [mode, setMode] = useState<Mode>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [runId, setRunId] = useState<string | null>(null);

  const router = useRouter();

  // Restore state on back / refresh
  useEffect(() => {
    const hasAnalyzed = localStorage.getItem("hasAnalyzed");
    const savedState = localStorage.getItem("pipelineState");
    const savedMode = localStorage.getItem("mode");
    const savedUrl = localStorage.getItem("repoUrl");

    if (hasAnalyzed === "true") {
      if (savedUrl) setRepoUrl(savedUrl);
      if (savedMode === "analyze" || savedMode === "analyze-setup") {
        setMode(savedMode);
      }
      if (savedState === "completed") {
        setPipelineState("completed");
      }
    }
  }, []);

  // ✅ CORRECT BACKEND-DRIVEN PIPELINE START
  const startPipeline = async (selectedMode: Mode) => {
    if (!repoUrl || !selectedMode) return;

    const res = await fetch("/api/pipeline/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl, mode: selectedMode }),
    });

    const data = await res.json();

    setRunId(data.runId);
    setMode(selectedMode);
    setPipelineState("running");

    localStorage.setItem("hasAnalyzed", "true");
    localStorage.setItem("pipelineState", "running");
    localStorage.setItem("mode", selectedMode);
    localStorage.setItem("repoUrl", repoUrl);
  };

  const completePipeline = () => {
    setPipelineState("completed");
    localStorage.setItem("pipelineState", "completed");
  };

  const resetAll = () => {
    localStorage.clear();
    setPipelineState("idle");
    setMode(null);
    setRepoUrl("");
    setRunId(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <WaveBackground />

      <h1 className="text-4xl font-semibold tracking-tight mb-3">
        REPOSITRON
      </h1>

      <p className="text-gray-400 mb-8 text-center max-w-xl">
        AI-powered zero-click developer onboarding
      </p>

      {/* INPUT */}
      <motion.div className="w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Paste GitHub repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="
            w-full px-4 py-3 rounded-lg
            bg-slate-900
            border border-slate-600
            text-white placeholder:text-slate-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-500/50
            focus:border-blue-500
            transition
          "
        />
      </motion.div>

      {/* ANALYZE BUTTONS */}
      {pipelineState === "idle" && (
        <div className="flex gap-4">
          <button
            onClick={() => startPipeline("analyze")}
            className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-black font-medium"
          >
            Analyze Only
          </button>

          <button
            onClick={() => startPipeline("analyze-setup")}
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium"
          >
            Analyze + Setup
          </button>
        </div>
      )}

      {/* PIPELINE */}
      {pipelineState === "running" && mode && runId && (
        <PipelineStatus
          mode={mode}
          runId={runId}
          onComplete={completePipeline}
        />
      )}

      {/* COMPLETED */}
      {pipelineState === "completed" && mode && (
        <>
          <div className="mt-6 text-green-400 text-sm">
            ✔ Pipeline completed successfully
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => router.push("/summary")}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded"
            >
              Repo Summary
            </button>

            {mode === "analyze-setup" && (
              <button
                onClick={() => router.push("/setup")}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded"
              >
                Setup Guide
              </button>
            )}
          </div>

          <button
            onClick={resetAll}
            className="mt-6 text-sm text-red-400 underline"
          >
            New Analysis
          </button>
        </>
      )}
    </main>
  );
}
