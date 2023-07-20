import { model, Schema } from "mongoose";

import { Role } from "@/types/credential";

const credentialSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
      default: Role.user,
    },
  },
  { timestamps: true },
);

export default model("Credential", credentialSchema);
