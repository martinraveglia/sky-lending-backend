import { type InferSchemaType, type ObjectId } from "mongoose";

import type UserModel from "@/models/User";

export type User = InferSchemaType<typeof UserModel.schema> & { _id: ObjectId };
