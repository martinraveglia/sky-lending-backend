import { badRequest } from "@hapi/boom";
import { type NextFunction, type Request, type Response } from "express";
import {
  date,
  number,
  object,
  type ObjectSchema,
  string,
  ValidationError,
} from "yup";

import { type UserYup } from "@/types/user";

const UserPersonalInformationYupSchema: ObjectSchema<Partial<UserYup>> = object(
  {
    firstName: string()
      .min(2, "first name is too short - should be 2 chars minimum")
      .max(30, "first name is too long - should be 30 chars maximum")
      .when("$onUpdate", {
        is: true,
        then: (schema) => schema.optional(),
        otherwise: (schema) => schema.required(),
      }),
    lastName: string()
      .min(2, "last name is too short - should be 2 chars minimum")
      .max(30, "last name is too long - should be 30 chars maximum")
      .when("$onUpdate", {
        is: true,
        then: (schema) => schema.optional(),
        otherwise: (schema) => schema.required(),
      }),
    phone: string()
      .matches(/^\+[1-9]\d{10,12}$/, "phone number is invalid")
      .when("$onUpdate", {
        is: true,
        then: (schema) => schema.optional(),
        otherwise: (schema) => schema.required(),
      }),
    SSN: number()
      .positive()
      .integer()
      .test(
        "len",
        "SSN must be exactly 9 digits",
        (ssn) => ssn == null || ssn.toString().length === 9,
      )
      .when("$onUpdate", {
        is: true,
        then: (schema) => schema.optional(),
        otherwise: (schema) => schema.required(),
      }),
    DoB: date()
      .max(new Date(), "DoB should be before today")
      .when("$onUpdate", {
        is: true,
        then: (schema) => schema.optional(),
        otherwise: (schema) => schema.required(),
      }),
  },
);

export const validatePersonalInformationPayload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, phone, SSN, DoB } = req.body;

    await UserPersonalInformationYupSchema.validate(
      {
        firstName,
        lastName,
        phone,
        SSN,
        DoB,
      },
      { context: { onUpdate: req.method === "PATCH" } },
    );

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      next(badRequest(error.message));
      return;
    }
    next(error);
  }
};
