import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  // setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: [
    "src/controllers/**/*.ts",
    "!src/controllers/**/*.d.ts",
  ],
};

export default config;
