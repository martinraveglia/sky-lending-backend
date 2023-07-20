import { forbidden, internal, unauthorized } from "@hapi/boom";
import { type NextFunction, type Request, type Response } from "express";
import { verify } from "jsonwebtoken";

import envVariables from "@/constants/envVariables";
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

    if (!authorization) throw forbidden("Provide a token");

    if (!authorization.startsWith(BEARER_STRING)) {
      throw unauthorized("Invalid token format");
    }

    const token = authorization.replace(BEARER_STRING, "");

    const { role, id } = verify(
      token,
      envVariables.JWT_TOKEN_SECRET,
    ) as TokenPayload;

    if (role !== Role.user) throw unauthorized("Provide a valid user token");

    const user = await User.findOne({
      _id: id,
    });
    if (!user) throw internal("User does not exists.");

    res.locals.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
