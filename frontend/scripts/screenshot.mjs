import { spawn, execSync } from "node:child_process";
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, "..");
const previewPath = path.resolve(frontendDir, "..", "preview.png");

execSync("npm run build", { cwd: frontendDir, stdio: "inherit" });

const server = spawn("npx", ["vite", "preview", "--port", "4173", "--strictPort"], {
  cwd: frontendDir,
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (d) => { serverOutput += d.toString(); });
server.stderr.on("data", (d) => { serverOutput += d.toString(); });

await new Promise<void>((resolve) => {
  const check = () => {
    if (serverOutput.includes("localhost:4173") || serverOutput.includes("Local:")) return resolve();
    setTimeout(check, 200);
  };
  check();
  setTimeout(resolve, 8000);
});

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: previewPath, fullPage: true });
  console.log("Screenshot saved:", previewPath);
  await browser.close();
} finally {
  server.kill("SIGTERM");
}
