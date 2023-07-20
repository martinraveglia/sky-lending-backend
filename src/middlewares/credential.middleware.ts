import Boom from "@hapi/boom";
import { type NextFunction, type Request, type Response } from "express";
import { object, type ObjectSchema, string, ValidationError } from "yup";

import { PASSWORD_VALIDATION } from "@/constants/regexs";
import { type CredentialYup } from "@/types/credential";

const CredentialYupSchema: ObjectSchema<CredentialYup> = object({
  username: string()
    .required("username is required")
    .min(2, "username is too short - 2 characters minimum")
    .max(30, "username is too long - 30 characters maximum"),
  password: string()
    .required("password is required")
    .matches(PASSWORD_VALIDATION, "password is invalid"),
});

export const validateSignUpPayload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("req", req.body);
    const { username, password } = req.body;

    await CredentialYupSchema.validate(
      {
        username,
        password,
      },
      { strict: true },
    );

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      next(Boom.badRequest(error.message));
      return;
    }
    next(error);
  }
};
