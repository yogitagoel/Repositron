import repoSummary from "../../outputs/repo_summary.json";

export default function SummaryPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-700 rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Repository Summary
        </h1>

        <div className="space-y-4 text-gray-300 text-sm">
          <p>
            <strong className="text-white">Tech Stack:</strong>{" "}
            {repoSummary.stack.join(", ")}
          </p>

          <p>
            <strong className="text-white">Entry Points:</strong>{" "}
            {repoSummary.entryPoints.join(", ")}
          </p>

          <p>
            <strong className="text-white">Services:</strong>{" "}
            {repoSummary.services.join(", ")}
          </p>

          <p>
            <strong className="text-white">Env Vars:</strong>{" "}
            {repoSummary.envVars.join(", ")}
          </p>
        </div>
      </div>
    </main>
  );
}
