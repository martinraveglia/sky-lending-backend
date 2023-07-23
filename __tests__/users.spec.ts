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

    it("It should respond the POST method with a 500, when no associated credential is found", async () => {
      verify.mockImplementationOnce(() => ({
        role: Role.user,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      mockingoose(Credential).toReturn(null, "findOne");

      const response = await request(app)
        .post(p("createPersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "credential does not exist" });
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
        mockingoose(Credential).toReturn(MOCKED_CREDENTIALS[0], "findOne");
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

  describe(`Test the ${p("updatePersonalInformation")} endpoint`, () => {
    it("It should respond the PATCH method with a 403, when the header does not contain a token", async () => {
      const response = await request(app).patch(p("updatePersonalInformation"));
      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "provide a token" });
    });

    it("It should respond the PATCH method with a 401, when the token is invalid", async () => {
      const token = "INVALID_TOKEN";

      const response = await request(app)
        .patch(p("updatePersonalInformation"))
        .set("Authorization", token);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "invalid token format" });
    });

    it("It should respond the PATCH method with a 401, when the role is invalid", async () => {
      verify.mockImplementationOnce(() => ({
        role: Role.admin,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      const response = await request(app)
        .patch(p("updatePersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "provide a valid user token" });
    });

    it("It should respond the PATCH method with a 500, when no associated credential is found", async () => {
      verify.mockImplementationOnce(() => ({
        role: Role.user,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      mockingoose(Credential).toReturn(null, "findOne");

      const response = await request(app)
        .patch(p("updatePersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "credential does not exist" });
    });

    it("It should respond the PATCH method with a 500, when no associated user is found", async () => {
      verify.mockImplementationOnce(() => ({
        role: Role.user,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      mockingoose(Credential).toReturn(MOCKED_CREDENTIALS[0], "findOne");
      mockingoose(User).toReturn(null, "findOne");

      const response = await request(app)
        .patch(p("updatePersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "user does not exist" });
    });

    it.each`
      firstName | lastName     | SSN             | phone                     | DoB
      ${"J"}    | ${undefined} | ${"123456789"}  | ${"+1234567890123"}       | ${"03/02/1995"}
      ${"John"} | ${"D"}       | ${undefined}    | ${"+1234567890123"}       | ${"03/02/1995"}
      ${"John"} | ${"Doe"}     | ${"1234567890"} | ${undefined}              | ${"03/02/1995"}
      ${"John"} | ${"Doe"}     | ${"12345678"}   | ${"+1234567890123"}       | ${undefined}
      ${"John"} | ${"Doe"}     | ${"123456789"}  | ${"1234567890123"}        | ${"03/02/1995"}
      ${"John"} | ${"Doe"}     | ${"123456789"}  | ${"+1234567890"}          | ${"03/02/1995"}
      ${"John"} | ${"Doe"}     | ${"123456789"}  | ${"+1234567890123456789"} | ${"03/02/1995"}
      ${"John"} | ${"Doe"}     | ${"123456789"}  | ${"+12345678901"}         | ${"03/02/2099"}
      ${"John"} | ${"Doe"}     | ${"123456789"}  | ${"+12345678901"}         | ${"2099/02/03"}
    `(
      "It should respond to the PATCH method with a 400, when req has valid token but data is incorrect",
      async ({ firstName, lastName, SSN, phone, DoB }) => {
        verify.mockImplementation(() => ({
          role: Role.user,
          id: "FAKE_ID",
        }));
        const token = "VALID_TOKEN";
        mockingoose(User).toReturn(MOCKED_USERS[0], "findOne");
        const response = await request(app)
          .patch(p("updatePersonalInformation"))
          .set("Authorization", `Bearer ${token}`)
          .send({ firstName, lastName, SSN, phone, DoB });
        expect(response.statusCode).toBe(400);
      },
    );

    it("It should respond the PATCH method with a 201 when valid payload is sent", async () => {
      const { firstName, DoB, SSN } = MOCKED_USERS[0];
      const token = "VALID_TOKEN";
      mockingoose(User).toReturn(MOCKED_USERS[0], "findOne");
      mockingoose(Credential).toReturn(MOCKED_CREDENTIALS[0], "findOne");

      const response = await request(app)
        .patch(p("updatePersonalInformation"))
        .set("Authorization", `Bearer ${token}`)
        .send({ firstName, DoB, SSN });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        message: "SUCCESS",
      });
    });
  });

  describe(`Test the ${p("getPersonalInformation")} endpoint`, () => {
    it("It should respond the GET method with a 403, when the header does not contain a token", async () => {
      const response = await request(app).get(p("getPersonalInformation"));
      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "provide a token" });
    });

    it("It should respond the GET method with a 401, when the token is invalid", async () => {
      const token = "INVALID_TOKEN";

      const response = await request(app)
        .get(p("getPersonalInformation"))
        .set("Authorization", token);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "invalid token format" });
    });

    it("It should respond the GET method with a 401, when the role is invalid", async () => {
      verify.mockImplementationOnce(() => ({
        role: Role.admin,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      const response = await request(app)
        .get(p("getPersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "provide a valid user token" });
    });

    it("It should respond the GET method with a 500, when no associated credential is found", async () => {
      verify.mockImplementationOnce(() => ({
        role: Role.user,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      mockingoose(Credential).toReturn(null, "findOne");

      const response = await request(app)
        .get(p("getPersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "credential does not exist" });
    });

    it("It should respond the GET method with a 500, when no associated user is found", async () => {
      verify.mockImplementation(() => ({
        role: Role.user,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      mockingoose(Credential).toReturn(MOCKED_CREDENTIALS[0], "findOne");
      mockingoose(User).toReturn(null, "findOne");

      const response = await request(app)
        .get(p("getPersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "user does not exist" });
    });

    it("It should respond the GET method with a 201 when valid credentials are sent", async () => {
      const token = "VALID_TOKEN";
      mockingoose(User).toReturn(MOCKED_USERS[0], "findOne");
      mockingoose(Credential).toReturn(MOCKED_CREDENTIALS[0], "findOne");
      const { firstName, lastName, SSN, DoB, phone } = MOCKED_USERS[0];
      const expectedBody = {
        firstName,
        lastName,
        SSN,
        DoB: DoB.toJSON(),
        phone,
      };

      const response = await request(app)
        .get(p("getPersonalInformation"))
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expectedBody);
    });
  });

  describe(`Test the ${p("getAllPersonalInformation")} endpoint`, () => {
    it("It should respond the GET method with a 403, when the header does not contain a token", async () => {
      const response = await request(app).get(p("getAllPersonalInformation"));
      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ message: "provide a token" });
    });

    it("It should respond the GET method with a 401, when the token is invalid", async () => {
      const token = "INVALID_TOKEN";

      const response = await request(app)
        .get(p("getAllPersonalInformation"))
        .set("Authorization", token);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "invalid token format" });
    });

    it("It should respond the GET method with a 401, when the role is invalid", async () => {
      verify.mockImplementationOnce(() => ({
        role: Role.user,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      const response = await request(app)
        .get(p("getAllPersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "provide a valid admin token" });
    });

    it("It should respond the GET method with a 500, when no associated credential is found", async () => {
      verify.mockImplementation(() => ({
        role: Role.admin,
        id: "FAKE_ID",
      }));
      const token = "VALID_TOKEN";

      mockingoose(Credential).toReturn(null, "findOne");

      const response = await request(app)
        .get(p("getAllPersonalInformation"))
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: "credential does not exist" });
    });

    it("It should respond the GET method with a 201 when valid credentials are sent", async () => {
      const token = "VALID_TOKEN";
      const { firstName, lastName, SSN, DoB, phone } = MOCKED_USERS[0];
      const populatedResult = [
        {
          username: MOCKED_CREDENTIALS[0].username,
          user: { firstName, lastName, SSN, DoB, phone },
        },
      ];
      mockingoose(Credential).toReturn(MOCKED_CREDENTIALS[0], "findOne");
      mockingoose(Credential).toReturn(populatedResult, "find");
      Credential.schema.path("user", Object);

      const expectedBody = [
        {
          username: MOCKED_CREDENTIALS[0].username,
          firstName,
          lastName,
          SSN,
          DoB: DoB.toJSON(),
          phone,
        },
      ];

      const response = await request(app)
        .get(p("getAllPersonalInformation"))
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expectedBody);
    });
  });
});
