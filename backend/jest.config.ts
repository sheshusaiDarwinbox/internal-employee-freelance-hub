// export const preset = "ts-jest";
// export const testEnvironment = "node";
// export const collectCoverage = true;
// export const coverageDirectory = "coverage";
// export const coverageReporters = ["text", "lcov"];
// export const collectCoverageFrom = [
//   "src/controllers/**/*.ts",
//   "!src/controllers/**/*.d.ts",
// ];

// import type { Config } from "@jest/types";

// const config: Config.InitialOptions = {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   collectCoverage: true,
//   coverageDirectory: "coverage",
//   coverageReporters: ["text", "lcov"],
//   collectCoverageFrom: [
//     "src/controllers/**/*.ts",
//     "!src/controllers/**/*.d.ts",
//   ],
// };

// export default config;

import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: [
    "src/controllers/**/*.ts",
    "!src/controllers/**/*.d.ts",
  ],
};

export default config;
