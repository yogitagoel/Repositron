"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PipelineStatus from "../components/PipelineStatus";

type PipelineState = "idle" | "running" | "completed";
type Mode = "analyze" | "analyze-setup" | null;

export default function Home() {
  const [pipelineState, setPipelineState] =
    useState<PipelineState>("idle");
  const [mode, setMode] = useState<Mode>(null);
  const [repoUrl, setRepoUrl] = useState("");

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

  const startPipeline = (selectedMode: Mode) => {
    if (!repoUrl || !selectedMode) return;

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
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-4">REPOSITRON</h1>

      <p className="text-gray-400 mb-8 text-center max-w-xl">
        Zero-click developer onboarding
      </p>

      {/* INPUT */}
      <div className="w-full max-w-md mb-4">
        <input
          type="text"
          placeholder="Paste GitHub repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700"
        />
      </div>

      {/* ANALYZE BUTTONS — ONLY ON IDLE */}
      {pipelineState === "idle" && (
        <div className="flex gap-3">
          <button
            onClick={() => startPipeline("analyze")}
            className="px-4 py-2 bg-white text-black rounded font-medium"
          >
            Analyze Only
          </button>

          <button
            onClick={() => startPipeline("analyze-setup")}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Analyze + Setup
          </button>
        </div>
      )}

      {/* PIPELINE */}
      {pipelineState === "running" && mode && (
        <PipelineStatus mode={mode} onComplete={completePipeline} />
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
