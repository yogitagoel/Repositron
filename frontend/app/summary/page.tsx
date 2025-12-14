"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface RepoSummary {
  files: Array<{
    path: string;
    language: string;
    dependencies: string[];
  }>;
  commands: {
    install: string | null;
    test: string | null;
    start: string | null;
  };
}

export default function SummaryPage() {
  const [repoSummary, setRepoSummary] = useState<RepoSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepoSummary = async () => {
      try {
        const response = await fetch('/api/repo/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch repository summary');
        }
        const data = await response.json();
        setRepoSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRepoSummary();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-white">Loading repository summary...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-red-400">Error: {error}</div>
      </main>
    );
  }

  if (!repoSummary) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-gray-400">No repository summary available</div>
      </main>
    );
  }

  // Extract languages and file information
  const languages = [...new Set(repoSummary.files.map(file => file.language))];
  const fileTypes = repoSummary.files.reduce((acc, file) => {
    const ext = file.path.split('.').pop() || 'no-extension';
    acc[ext] = (acc[ext] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-4xl bg-gradient-to-b from-[#12182F] to-[#0E1325] border border-white/10 rounded-xl p-6"
      >
        <h1 className="text-2xl font-semibold mb-6 text-white">
          Repository Summary
        </h1>

        <div className="space-y-6 text-sm text-gray-300">
          {/* Languages Section */}
          <div>
            <h2 className="text-lg font-medium text-white mb-3">Programming Languages</h2>
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <span key={lang} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* File Structure Section */}
          <div>
            <h2 className="text-lg font-medium text-white mb-3">File Structure</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(fileTypes).map(([ext, count]) => (
                <div key={ext} className="flex justify-between p-2 bg-gray-800/50 rounded">
                  <span className="text-gray-300">.{ext}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Commands Section */}
          <div>
            <h2 className="text-lg font-medium text-white mb-3">Project Commands</h2>
            <div className="space-y-2">
              {repoSummary.commands.install && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                  <span className="text-green-300 font-medium">Install:</span>
                  <code className="ml-2 text-gray-300">{repoSummary.commands.install}</code>
                </div>
              )}
              {repoSummary.commands.test && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <span className="text-yellow-300 font-medium">Test:</span>
                  <code className="ml-2 text-gray-300">{repoSummary.commands.test}</code>
                </div>
              )}
              {repoSummary.commands.start && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                  <span className="text-purple-300 font-medium">Start:</span>
                  <code className="ml-2 text-gray-300">{repoSummary.commands.start}</code>
                </div>
              )}
            </div>
          </div>

          {/* Files List Section */}
          <div>
            <h2 className="text-lg font-medium text-white mb-3">Files ({repoSummary.files.length})</h2>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {repoSummary.files.map((file, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
                  <span className="text-gray-300">{file.path}</span>
                  <span className="text-xs text-gray-400">{file.language}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </main>
  );
}
