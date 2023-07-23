import express from "express";

import paths from "@/constants/paths";

import credential from "./credential";
import user from "./user";

const router = express.Router();
router.use(paths.user.base, user);
router.use(paths.credential.base, credential);

router.get("/", (_, res) => {
  res.send("Sky Lending Server");
});

export default router;
