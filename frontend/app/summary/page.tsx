"use client";

import { motion } from "framer-motion";
import repoSummary from "../../outputs/repo_summary.json";

export default function SummaryPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-xl bg-gradient-to-b from-[#12182F] to-[#0E1325] border border-white/10 rounded-xl p-6"
      >
        <h1 className="text-2xl font-semibold mb-6">
          Repository Summary
        </h1>

        <div className="space-y-4 text-sm text-gray-300">
          <p>
            <span className="text-white font-medium">Tech Stack:</span>{" "}
            {repoSummary.stack.join(", ")}
          </p>

          <p>
            <span className="text-white font-medium">Entry Points:</span>{" "}
            {repoSummary.entryPoints.join(", ")}
          </p>

          <p>
            <span className="text-white font-medium">Services:</span>{" "}
            {repoSummary.services.join(", ")}
          </p>

          <p>
            <span className="text-white font-medium">Environment Variables:</span>{" "}
            {repoSummary.envVars.join(", ")}
          </p>
        </div>
      </motion.div>
    </main>
  );
}

