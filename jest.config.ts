import type { Config } from 'jest';

import { name } from './package.json';

const config: Config = {
  clearMocks: true,
  displayName: name,
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default config;
