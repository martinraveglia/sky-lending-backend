import type { Config } from "jest";

import { name } from "./package.json";

const config: Config = {
  clearMocks: true,
  displayName: name,
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  preset: "ts-jest",
  testEnvironment: "node",
};

export default config;
