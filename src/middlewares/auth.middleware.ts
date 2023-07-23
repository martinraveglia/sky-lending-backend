import { forbidden, internal, unauthorized } from "@hapi/boom";
import { type NextFunction, type Request, type Response } from "express";
import { verify } from "jsonwebtoken";

import envVariables from "@/constants/envVariables";
import paths from "@/constants/paths";
import Credential from "@/models/Credential";
import User from "@/models/User";
import { Role, type TokenPayload } from "@/types/credential";

const BEARER_STRING = "Bearer ";

export const isUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    const userShouldExist =
      req.method !== "POST" ||
      !req.path.includes(paths.user.createPersonalInformation);

    if (!authorization) throw forbidden("provide a token");

    if (!authorization.startsWith(BEARER_STRING)) {
      throw unauthorized("invalid token format");
    }

    const token = authorization.replace(BEARER_STRING, "");

    const { role, id } = verify(
      token,
      envVariables.JWT_TOKEN_SECRET,
    ) as TokenPayload;

    if (role !== Role.user) throw unauthorized("provide a valid user token");

    const credential = await Credential.findOne({ _id: id });
    if (!credential) throw internal("credential does not exist");

    const user = await User.findOne({
      _id: credential.user,
    });
    if (!user && userShouldExist) throw internal("user does not exist");

    res.locals.user = user;
    res.locals.credential = id;

    next();
  } catch (error) {
    next(error);
  }
};
