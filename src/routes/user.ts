import express from "express";

import paths from "@/constants/paths";
import {
  createPersonalInformation,
  getAllPersonalInformation,
  getPersonalInformation,
  updatePersonalInformation,
} from "@/controllers/user.controller";
import {
  isAdminMiddleware,
  isUserMiddleware,
} from "@/middlewares/auth.middleware";
import { validatePersonalInformationPayload } from "@/middlewares/user.middleware";

const router = express.Router();

router.post(
  paths.user.createPersonalInformation,
  isUserMiddleware,
  validatePersonalInformationPayload,
  createPersonalInformation,
);

router.patch(
  paths.user.updatePersonalInformation,
  isUserMiddleware,
  validatePersonalInformationPayload,
  updatePersonalInformation,
);

router.get(
  paths.user.getPersonalInformation,
  isUserMiddleware,
  getPersonalInformation,
);

router.get(
  paths.user.getAllPersonalInformation,
  isAdminMiddleware,
  getAllPersonalInformation,
);

export default router;
