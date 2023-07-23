import express from "express";

import paths from "@/constants/paths";
import { createPersonalInformation } from "@/controllers/user.controller";
import { isUserMiddleware } from "@/middlewares/auth.middleware";
import { validatePersonalInformationPayload } from "@/middlewares/user.middleware";

const router = express.Router();

router.post(
  paths.user.createPersonalInformation,
  isUserMiddleware,
  validatePersonalInformationPayload,
  createPersonalInformation,
);

export default router;
