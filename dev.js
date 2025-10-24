import { spawn } from "child_process";
import open from "open";

const port = 3000;
const url = `http://localhost:${port}`;

// Start Next.js (same as running "next dev")
const devServer = spawn("next", ["dev"], {
  stdio: "inherit",
  shell: true, // Important for cross-platform compatibility
});

// After a delay, open the browser
const delay = 2000; // 2 seconds - can adjust if needed
setTimeout(() => {
  console.log(`\n🚀 Opening browser at ${url}...\n`);
  open(url);
}, delay);

// If the server crashes or is stopped, kill this process too
devServer.on("close", () => {
  console.log("\n🛑 Dev server stopped.");
  process.exit();
});
