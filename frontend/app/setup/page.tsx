export default function SetupPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-700 rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Project Setup Guide
        </h1>

        <div className="space-y-3 text-gray-300 text-sm">
          <p>
            <strong className="text-white">1. Install Dependencies:</strong>{" "}
            Run the package manager command detected by Cline (npm / yarn /
            pnpm).
          </p>

          <p>
            <strong className="text-white">
              2. Configure Environment Variables:
            </strong>{" "}
            Create a <code className="text-gray-200">.env</code> file using the
            generated <code className="text-gray-200">.env.example</code>.
          </p>

          <p>
            <strong className="text-white">3. Run Setup Scripts:</strong>{" "}
            Execute the setup scripts generated during onboarding.
          </p>

          <p>
            <strong className="text-white">
              4. Start Development Server:
            </strong>{" "}
            Launch the application locally to verify setup.
          </p>
        </div>
      </div>
    </main>
  );
}
