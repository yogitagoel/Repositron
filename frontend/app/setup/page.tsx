"use client";

import { motion } from "framer-motion";

export default function SetupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-xl bg-gradient-to-b from-[#12182F] to-[#0E1325] border border-white/10 rounded-xl p-6"
      >
        <h1 className="text-2xl font-semibold mb-6">
          Project Setup Guide
        </h1>

        <div className="space-y-4 text-sm text-gray-300">
          <p>
            <span className="text-white font-medium">
              Install Dependencies:
            </span>{" "}
            Use the package manager detected by Cline (npm / yarn / pnpm).
          </p>

          <p>
            <span className="text-white font-medium">
              Configure Environment Variables:
            </span>{" "}
            Create a <code className="text-gray-200">.env</code> file using{" "}
            <code className="text-gray-200">.env.example</code>.
          </p>

          <p>
            <span className="text-white font-medium">
              Run Setup Scripts:
            </span>{" "}
            Execute the setup scripts generated during onboarding.
          </p>

          <p>
            <span className="text-white font-medium">
              Start Development Server:
            </span>{" "}
            Run the development server to verify the setup.
          </p>
        </div>
      </motion.div>
    </main>
  );
}


