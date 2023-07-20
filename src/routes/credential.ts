import express from "express";

import { userRegistration } from "@/controllers/credential.controller";
import { validateSignUpPayload } from "@/middlewares/credential.middleware";

const router = express.Router();

router.post("/sign-up", validateSignUpPayload, userRegistration);

export default router;
