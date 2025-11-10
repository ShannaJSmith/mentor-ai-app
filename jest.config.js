const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // support "@/components/..." imports
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // load jest-dom matchers
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], // ignore Next.js build output
};
