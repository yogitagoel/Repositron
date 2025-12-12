const fs = require("fs");
const path = require("path");
const { runClineCommand } = require("./runner");
const { execSync } = require("child_process");

// Load JSON
const metadata = JSON.parse(fs.readFileSync(path.join(__dirname, "ex.json")));

async function start() {
  const repoUrl = metadata.repoUrl;
  const repoName = repoUrl.split("/").pop();
  const repoPath = path.join(__dirname, "repos", repoName);

  // Delete old repo folder if exists
  if (fs.existsSync(repoPath)) {
    console.log("🗑️ Removing old repo...");
    fs.rmSync(repoPath, { recursive: true, force: true });
  }

  // Clone repo
  console.log("📥 Cloning repo:", repoUrl);
  execSync(`git clone ${repoUrl} ${repoPath}`, { stdio: "inherit" });

  // Build commands
  const commands = [];
  commands.push(`cd ${repoPath} && ${metadata.installCommand}`);
  commands.push(`cd ${repoPath} && ${metadata.runCommand}`);

  console.log("🚀 Running Cline automation...\n");

  // Run commands through Cline
  for (let cmd of commands) {
  await runClineCommand(cmd, repoPath, metadata);
}

  console.log("\n🎉 Automation finished!");
}

start();
