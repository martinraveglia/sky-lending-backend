import express from "express";

import paths from "@/constants/paths";
import {
  userLogIn,
  userRegistration,
} from "@/controllers/credential.controller";
import { validateCredentialPayload } from "@/middlewares/credential.middleware";

const router = express.Router();

router.post(
  paths.credential.signUp,
  validateCredentialPayload,
  userRegistration,
);

router.post(paths.credential.logIn, validateCredentialPayload, userLogIn);

export default router;
