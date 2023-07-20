import type { Config } from "jest";

import { name } from "./package.json";

// Testing Env Variables
process.env = { JWT_TOKEN_SECRET: "TEST_TOKEN_SECRET" };

const config: Config = {
  preset: "ts-jest",
  clearMocks: true,
  displayName: name,
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
};

export default config;
