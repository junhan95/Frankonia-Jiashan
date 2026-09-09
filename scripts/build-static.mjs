import { spawnSync } from "node:child_process";
import { stagingEnv } from "./staging-env.mjs";

/**
 * Reproduces the GitHub Pages build locally.
 *
 * This used to be `STATIC_EXPORT=1 ... next build` inline in package.json,
 * which is POSIX-only: on Windows both cmd.exe and PowerShell reject it, so
 * `npm run build:static` failed for anyone on Windows. Setting the variables
 * from Node keeps one command that works everywhere.
 */
const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, ...stagingEnv },
});

process.exit(result.status ?? 1);
