import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // 👈 Use jsdom since your app pages are React components

  roots: ["<rootDir>/test"],

  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // ✅ Collect coverage from everything inside /src, including /app pages
  collectCoverage: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",        // All source files
    "src/app/**/*.{ts,tsx,js,jsx}",    // All Next.js app routes/pages
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/*.test.{ts,tsx,js,jsx}",
    "!src/**/index.{ts,tsx,js,jsx}",
    "!src/**/*.config.{ts,js}",
  ],

  // ✅ Ensure even untested files in /app show up
  forceCoverageMatch: ["src/app/**/*.{ts,tsx,js,jsx}"],

  // ✅ Output in all useful formats
  coverageDirectory: "coverage",
  coverageReporters: ["text", "text-summary", "lcov", "html"],

  // ✅ Ignore build/test artifacts
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/test/",
    "/.next/",
    "/dist/",
    "/coverage/",
  ],

  clearMocks: true,
  testTimeout: 10000,

  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { isolatedModules: true }],
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],

  // ✅ Global thresholds for your grade
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
