import { type InferSchemaType, type Types } from "mongoose";

import type CredentialModel from "@/models/Credential";

export type Credential = InferSchemaType<typeof CredentialModel.schema> & {
  _id: Types.ObjectId;
};

export type CredentialYup = Pick<Credential, "password" | "username">;

export enum Role {
  user = "USER",
  admin = "ADMIN",
}

export interface TokenPayload {
  id: string;
  username: string;
  role: Role;
}
