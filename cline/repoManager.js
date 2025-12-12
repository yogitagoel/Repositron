const { exec } = require("child_process");
const path = require("path");

exports.cloneRepo = (repoUrl) => {
  return new Promise((resolve) => {
    const repoName = repoUrl.split("/").pop().replace(".git", "");
    const repoPath = path.join(__dirname, "repos", repoName);

    console.log("Cloning repo:", repoUrl);
    console.log("Destination:", repoPath);

    const clone = exec(`git clone ${repoUrl} ${repoPath}`);

    clone.stdout.on("data", (data) => console.log("GIT:", data.toString()));
    clone.stderr.on("data", (data) => console.log("GIT ERR:", data.toString()));
    clone.on("close", () => {
      console.log("Clone completed");
      resolve(repoPath);
    });
  });
};
