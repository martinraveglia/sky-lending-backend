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
    const { credential } = res.locals;

    const foundCredential = await Credential.findOne({
      _id: credential,
    });

    if (!foundCredential) {
      throw internal("credential does not exist");
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

export const updatePersonalInformation = async (
  req: Request<ParamsDictionary, any, Partial<UserYup>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, DoB, SSN, phone } = req.body;
    const {
      user: { _id },
      credential,
    } = res.locals;

    const foundCredential = await Credential.findOne({
      _id: credential,
    });

    if (!foundCredential) {
      throw internal("credential does not exist");
    }

    await User.findOneAndUpdate(
      { _id },
      {
        firstName,
        lastName,
        DoB,
        SSN,
        phone,
      },
    );

    return res.status(201).json({ message: "SUCCESS" });
  } catch (error) {
    next(error);
  }
};
