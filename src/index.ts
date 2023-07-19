import "dotenv/config";

import mongoose from "mongoose";

import app from "@/app";

import envVariables, { validateEnvVars } from "./constants/envVariables";

const { PORT, DATABASE_NAME, DATABASE_PASS, DATABASE_URL, DATABASE_USER } =
  envVariables;

const startServer = async (): Promise<void> => {
  validateEnvVars();

  try {
    await mongoose.connect(DATABASE_URL, {
      user: DATABASE_USER,
      pass: DATABASE_PASS,
      dbName: DATABASE_NAME,
    });
    console.log("🟢 - DB Connected");
  } catch (error) {
    console.log("🔴 - DB Error : %o", error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}!`);
  });
};

void startServer();
