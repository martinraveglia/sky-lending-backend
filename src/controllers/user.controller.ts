import { internal } from "@hapi/boom";
import { type NextFunction, type Request, type Response } from "express";
import { type ParamsDictionary } from "express-serve-static-core";

import Credential from "@/models/Credential";
import User from "@/models/User";
import { Role } from "@/types/credential";
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
    } = res.locals;

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

export const getPersonalInformation = async (
  req: Request<ParamsDictionary, any, Partial<UserYup>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      user: { _id },
      username,
    } = res.locals;

    const foundUser = await User.findOne({ _id });
    if (!foundUser) throw internal("user does not exist");

    const { firstName, lastName, SSN, DoB, phone }: UserYup = foundUser;

    return res
      .status(201)
      .json({ firstName, lastName, SSN, DoB, phone, username });
  } catch (error) {
    next(error);
  }
};

export const getAllPersonalInformation = async (
  req: Request<ParamsDictionary, any, Partial<UserYup>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await Credential.find().populate<{
      user: UserYup | undefined;
    }>("user");
    const responsePayload = users
      .filter((credential) => credential.role === Role.user)
      .map((credential) => ({
        username: credential.username,
        firstName: credential.user?.firstName,
        lastName: credential.user?.lastName,
        SSN: credential.user?.SSN,
        phone: credential.user?.phone,
        DoB: credential.user?.DoB,
      }));

    return res.status(201).json(responsePayload);
  } catch (error) {
    next(error);
  }
};
