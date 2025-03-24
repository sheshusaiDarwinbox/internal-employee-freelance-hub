import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  // setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: [
    "src/controllers/**/*.ts",
    "src/models/**/*.ts",
    "!src/**/*.d.ts",
  ],
  testMatch: [
    "<rootDir>/src/__tests__/controllers/*",
    "<rootDir>/src/__tests__/models/*",
    // Add more specific test files as needed
  ],
};

export default config;
