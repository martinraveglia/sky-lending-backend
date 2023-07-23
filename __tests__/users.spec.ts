import jwt from "jsonwebtoken";
import request from "supertest";

import app from "@/app";
import { MOCKED_CREDENTIALS, MOCKED_USERS } from "@/constants/mockedData";
import paths from "@/constants/paths";
import Credential from "@/models/Credential";
import User from "@/models/User";
import { Role } from "@/types/credential";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require("mockingoose");

const verify = jest.spyOn(jwt, "verify");

const p = (path: keyof typeof paths.user) =>
  paths.base + paths.user.base + paths.user[path];

const validPayload = {
  firstName: "John",
  lastName: "Doe",
  SSN: "123456789",
  phone: "+123456789012",
  DoB: "03/02/1995",
};

describe("Test the users controllers", () => {
  describe(`Test the ${p("createPersonalInformation")} endpoint`, () => {
    it("It should respond the POST method with a 403, when the header does not contain a token", async () => {
      const response = await request(app).post(p("createPersonalInformation"));
      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "provide a token" });
    });

    it("It should respond the POST method with a 401, when the token is invalid", async () => {
      const token = "INVALID_TOKEN";

      const response = await request(app)
        .post(p("createPersonalInformation"))
        .set("Authorization", token);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "invalid token format" });
    });

    it("It should respond the POST method with a 401, when the role is invalid", async () => {
      verify.mockImplementationOnce(() => ({
        role: Role.admin,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      const response = await request(app)
        .post(p("createPersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "provide a valid user token" });
    });

    it.each`
      firstName | lastName | SSN             | phone                     | DoB
      ${"J"}    | ${"Doe"} | ${"123456789"}  | ${"+1234567890123"}       | ${"03/02/1995"}
      ${"John"} | ${"D"}   | ${"123456789"}  | ${"+1234567890123"}       | ${"03/02/1995"}
      ${"John"} | ${"Doe"} | ${"1234567890"} | ${"+1234567890123"}       | ${"03/02/1995"}
      ${"John"} | ${"Doe"} | ${"12345678"}   | ${"+1234567890123"}       | ${"03/02/1995"}
      ${"John"} | ${"Doe"} | ${"123456789"}  | ${"1234567890123"}        | ${"03/02/1995"}
      ${"John"} | ${"Doe"} | ${"123456789"}  | ${"+1234567890"}          | ${"03/02/1995"}
      ${"John"} | ${"Doe"} | ${"123456789"}  | ${"+1234567890123456789"} | ${"03/02/1995"}
      ${"John"} | ${"Doe"} | ${"123456789"}  | ${"+12345678901"}         | ${"03/02/2099"}
      ${"John"} | ${"Doe"} | ${"123456789"}  | ${"+12345678901"}         | ${"2099/02/03"}
    `(
      "It should respond to the POST method with a 400, when req has valid token but data is incorrect",
      async ({ firstName, lastName, SSN, phone, DoB }) => {
        verify.mockImplementation(() => ({
          role: Role.user,
          id: "FAKE_ID",
        }));
        const token = "VALID_TOKEN";

        const response = await request(app)
          .post(p("createPersonalInformation"))
          .set("Authorization", `Bearer ${token}`)
          .send({ firstName, lastName, SSN, phone, DoB });
        expect(response.statusCode).toBe(400);
      },
    );
    it("It should respond the POST method with a 500, when no associated credential is found", async () => {
      mockingoose(User).toReturn(null, "findOne");
      const token = "VALID_TOKEN";

      const response = await request(app)
        .post(p("createPersonalInformation"))
        .set("Authorization", `Bearer ${token}`)
        .send(validPayload);
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "credential not found" });
    });

    it("It should respond the POST method with a 201 when valid payload is sent", async () => {
      const token = "VALID_TOKEN";
      mockingoose(Credential).toReturn(MOCKED_CREDENTIALS[0], "findOne");

      const response = await request(app)
        .post(p("createPersonalInformation"))
        .set("Authorization", `Bearer ${token}`)
        .send(MOCKED_USERS[0]);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        message: "SUCCESS",
      });
    });
  });
});
