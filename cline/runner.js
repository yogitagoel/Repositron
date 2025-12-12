const {exec}=require("child_process");

function execCline(prompt) {
  return new Promise((resolve) => {
    console.log("Running Cline:", prompt);
    exec(`cline run "${prompt}"`, (err, stdout, stderr) => {
      const output=stdout |stderr;
      console.log(output);
      resolve(output);
    });
  });
}

exports.runClineCommand = async function(command, repoPath, metadata) {
  let output = await execCline(command);

  // If web app → open browser
  if (metadata.appType === "web" && metadata.defaultUrl) {
    console.log("🌐 Opening browser:", metadata.defaultUrl);
    await execCline(`open ${metadata.defaultUrl}`);
  }
  
  // Detect errors
  if (
    output.includes("Error") ||
    output.includes("ERR!") ||
    output.includes("failed") ||
    output.includes("Traceback")
  ) {
    console.log("❗ Error detected. Asking Cline to fix it...");

    const fixPrompt = `
      The command failed: "${command}"
      Read the logs, find the cause of error in the project at ${repoPath},
      fix the issue, and retry the command.
    `;
    await execCline(fixPrompt);
    console.log("Retrying original command...");
    await execCline(command);
  }
};
