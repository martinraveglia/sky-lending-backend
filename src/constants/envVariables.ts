const envVars = {
  PORT: process.env.PORT ?? "4000",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  DATABASE_NAME: process.env.DATABASE_NAME ?? "",
  DATABASE_USER: process.env.DATABASE_USER ?? "",
  DATABASE_PASS: process.env.DATABASE_PASS ?? "",
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET ?? "",
  NUMVERIFY_API_KEY: process.env.NUMVERIFY_API_KEY ?? "",
};

const expectedEnvVariables: Array<keyof typeof envVars> = [
  "DATABASE_NAME",
  "DATABASE_PASS",
  "DATABASE_URL",
  "DATABASE_USER",
  "JWT_TOKEN_SECRET",
  "NUMVERIFY_API_KEY",
];

export const validateEnvVars = (): void => {
  expectedEnvVariables.forEach((envName) => {
    if (process.env[envName] == null)
      throw new Error(
        `Environment variable '${envName}' is missing and required`,
      );
  });
};

export default Object.freeze(envVars);
