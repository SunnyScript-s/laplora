import { defineConfig, devices } from '@playwright/test';
import { dirname, join } from 'node:path';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const webkitExecutable = process.env.LAPLORA_WEBKIT_EXECUTABLE_PATH;
const webkitRoot = webkitExecutable ? dirname(dirname(webkitExecutable)) : undefined;
// The cloud can use locally extracted, verified system libraries. The bundled
// WebKit shell wrapper overwrites LD_LIBRARY_PATH, so use its supported binary override.
const webkitLaunch = webkitExecutable && webkitRoot ? {
  executablePath: webkitExecutable,
  env: {
    ...process.env,
    WEBKIT_EXEC_PATH: join(webkitRoot, 'bin'),
    WEBKIT_INJECTED_BUNDLE_PATH: join(webkitRoot, 'lib'),
    WEBKIT_INSPECTOR_RESOURCES_PATH: join(webkitRoot, 'share'),
    LD_LIBRARY_PATH: [join(webkitRoot, 'lib'), join(webkitRoot, 'sys/lib'), process.env.LD_LIBRARY_PATH].filter(Boolean).join(':'),
  },
} : {};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // Shared CI runners contend on animated WebKit pages when two flows run together.
  workers: process.env.CI ? 1 : 2,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], launchOptions: executablePath ? { executablePath } : {} } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'], launchOptions: executablePath ? { executablePath } : {} } },
    ...(process.env.LAPLORA_CROSS_BROWSER === '1' ? [
      { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit-desktop', use: { ...devices['Desktop Safari'], launchOptions: webkitLaunch } },
      { name: 'webkit-mobile', use: { ...devices['iPhone 13'], launchOptions: webkitLaunch } },
    ] : []),
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
