import { defineConfig } from "vitest/config";

const requestedConcurrency = Number.parseInt(process.env.REPOSITORY_CHECK_CONCURRENCY ?? "4", 10);
const maxConcurrency = Number.isSafeInteger(requestedConcurrency) && requestedConcurrency > 0
  ? requestedConcurrency
  : 4;

export default defineConfig({
  test: {
    include: ["test/**/*.test.mjs"],
    fileParallelism: true,
    maxWorkers: maxConcurrency,
    minWorkers: Math.min(2, maxConcurrency),
    pool: "forks",
    passWithNoTests: false,
    silent: "passed-only",
    testTimeout: 125_000,
  },
});
