import { spawn } from "child_process";

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

console.log("🚀 Starting FranchiseOpsAI Backend & Frontend services...");

const backend = spawn(npmCmd, ["--prefix", "backend", "run", "dev"], {
  stdio: "inherit",
  shell: true,
});

const frontend = spawn(npmCmd, ["--prefix", "frontend", "run", "dev"], {
  stdio: "inherit",
  shell: true,
});

function handleExit(code, service) {
  console.log(`[${service}] process exited with code ${code}`);
}

backend.on("exit", (code) => handleExit(code, "Backend"));
frontend.on("exit", (code) => handleExit(code, "Frontend"));

process.on("SIGINT", () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
