import { type InferSchemaType, type Types } from "mongoose";

import type UserModel from "@/models/User";

export type User = InferSchemaType<typeof UserModel.schema> & {
  _id: Types.ObjectId;
};

export type UserYup = Omit<User, "_id" | "createdAt" | "updatedAt">;

export interface UserLocals {
  user: User;
}
