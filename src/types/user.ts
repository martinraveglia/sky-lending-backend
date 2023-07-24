import { type InferSchemaType, type Types } from "mongoose";

import type UserModel from "@/models/User";

export type User = InferSchemaType<typeof UserModel.schema> & {
  _id: Types.ObjectId;
};

export type UserYup = Omit<User, "_id" | "createdAt" | "updatedAt">;

export interface UserLocals {
  user: User;
}

export type phoneExternalValidationResponse =
  phoneExternalValidationErrorResponse &
    phoneExternalValidationSuccessfulResponse;

interface phoneExternalValidationErrorResponse {
  success: boolean | undefined;
  error: {
    code: number;
    type: string;
    info: string;
  };
}
interface phoneExternalValidationSuccessfulResponse {
  valid: boolean | undefined;
  number: string;
  local_format: string;
  international_format: string;
  country_prefix: string;
  country_code: string;
  country_name: string;
  location: string;
  carrier: string;
  line_type: LINE_TYPE | null;
}

enum LINE_TYPE {
  mobile = "mobile",
  landline = "landline",
  special_services = "special_services",
  toll_free = "toll_free",
  premium_rate = "premium_rate",
  satellite = "satellite",
  paging = "paging",
}
