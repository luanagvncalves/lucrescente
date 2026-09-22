import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.e2e.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:3211",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- -p 3211",
    url: "http://127.0.0.1:3211",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
