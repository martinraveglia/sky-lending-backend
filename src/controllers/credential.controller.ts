import { conflict } from "@hapi/boom";
import { hash } from "bcryptjs";
import { type NextFunction, type Request, type Response } from "express";
import { type ParamsDictionary } from "express-serve-static-core";
import { sign } from "jsonwebtoken";

import envVariables from "@/constants/envVariables";
import Credential from "@/models/Credential";
import {
  type CredentialYup,
  Role,
  type TokenPayload,
} from "@/types/credential";

export const userRegistration = async (
  req: Request<ParamsDictionary, any, CredentialYup>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, username } = req.body;
    const foundCredential = await Credential.findOne({ username });

    if (foundCredential) {
      throw conflict("username already exists");
    }

    const encryptedPassword = await hash(password, 10);

    const newCredential = new Credential({
      username,
      password: encryptedPassword,
    });
    await newCredential.save();

    const tokenPayload: TokenPayload = {
      id: newCredential.id,
      username,
      role: Role.user,
    };

    const accessToken = sign(tokenPayload, envVariables.JWT_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json(accessToken);
  } catch (error) {
    next(error);
  }
};
