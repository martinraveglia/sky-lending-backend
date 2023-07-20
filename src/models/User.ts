import { model, Schema } from "mongoose";

import { PHONE_REGEX, SSN_REGEX } from "@/constants/regexs";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    phone: {
      type: String,
      required: true,
      match: PHONE_REGEX,
      unique: true,
    },
    SSN: {
      type: Number,
      required: true,
      unique: true,
      match: SSN_REGEX,
    },
    DoB: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("User", userSchema);
