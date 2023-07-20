import { Types } from "mongoose";

import { type Credential, Role } from "@/types/credential";

const now = new Date();

const minutesSum = (minutes: number, date: Date = now) =>
  new Date(date.setMinutes(date.getMinutes() + minutes));

export const MOCKED_CREDENTIALS: Credential[] = [
  {
    _id: new Types.ObjectId("507f191e810c19729de86001"),
    username: "Fake Username 1",
    password: "FakePassword1",
    role: Role.user,
    createdAt: minutesSum(-10),
    updatedAt: now,
  },
  {
    _id: new Types.ObjectId("507f191e810c19729de86002"),
    username: "Fake Username 2",
    password: "FakePassword2",
    role: Role.user,
    createdAt: minutesSum(-10),
    updatedAt: now,
    user: new Types.ObjectId("5ca4af76384306089c1c3ff2"),
  },
  {
    _id: new Types.ObjectId("507f191e810c19729de86003"),
    username: "Fake Username 3",
    password: "FakePassword3",
    role: Role.admin,
    createdAt: minutesSum(-10),
    updatedAt: now,
  },
];
