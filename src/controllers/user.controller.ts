import { internal } from "@hapi/boom";
import { type NextFunction, type Request, type Response } from "express";
import { type ParamsDictionary } from "express-serve-static-core";

import Credential from "@/models/Credential";
import User from "@/models/User";
import { type UserYup } from "@/types/user";

export const createPersonalInformation = async (
  req: Request<ParamsDictionary, any, UserYup>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, DoB, SSN, phone } = req.body;

    const foundCredential = await Credential.findOne({
      _id: res.locals.credential,
    });

    if (!foundCredential) {
      throw internal("credential not found");
    }

    const newUser = new User({
      firstName,
      lastName,
      DoB,
      SSN,
      phone,
    });
    await newUser.save();

    foundCredential.user = newUser._id;
    await foundCredential.save();

    return res.status(201).json({ message: "SUCCESS" });
  } catch (error) {
    next(error);
  }
};
