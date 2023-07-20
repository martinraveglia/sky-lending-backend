import { hashSync } from "bcryptjs";
import { type Types } from "mongoose";
import request from "supertest";

import app from "@/app";
import { MOCKED_CREDENTIALS } from "@/constants/mockedData";
import paths from "@/constants/paths";
import Credential from "@/models/Credential";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require("mockingoose");

const p = (path: keyof typeof paths.credential) =>
  paths.base + paths.credential.base + paths.credential[path];

describe("Test the credentials controllers", () => {
  describe(`Test the ${p("logIn")} endpoint`, () => {
    it.each`
      username         | password
      ${undefined}     | ${undefined}
      ${undefined}     | ${"PASSWORD123"}
      ${"USERNAME123"} | ${undefined}
    `(
      "It should respond the POST method with a 401, when the body payload is invalid",
      async ({ username, password }) => {
        const response = await request(app)
          .post(p("logIn"))
          .send({ username, password });
        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({ message: "invalid credentials" });
      },
    );

    it("It should respond the POST method with a 401, when no associated credential is found", async () => {
      mockingoose(Credential).toReturn(null, "findOne");
      const response = await request(app)
        .post(p("logIn"))
        .send({ username: "USERNAME", password: "PassWord123" });
      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "invalid credentials" });
    });

    it("It should respond the POST method with a 401, when password does not match", async () => {
      const userCredentials = MOCKED_CREDENTIALS[0];
      const hashedPassword = hashSync(userCredentials.password);
      mockingoose(Credential).toReturn(
        { ...userCredentials, password: hashedPassword },
        "findOne",
      );
      const response = await request(app).post(p("logIn")).send({
        username: userCredentials.username,
        password: "InvalidPassword123",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: "invalid credentials" });
    });

    it.each`
      userCredentials
      ${MOCKED_CREDENTIALS[0]}
      ${MOCKED_CREDENTIALS[1]}
      ${MOCKED_CREDENTIALS[2]}
    `(
      "It should respond the POST method with a 201 when username and password are correct",
      async ({ userCredentials }) => {
        const hashedPassword = hashSync(userCredentials.password);
        mockingoose(Credential).toReturn(
          { ...userCredentials, password: hashedPassword },
          "findOne",
        );
        const response = await request(app).post(p("logIn")).send({
          username: userCredentials.username,
          password: userCredentials.password,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual<{
          token: string;
          userCreated: Types.ObjectId | false;
        }>({
          token: expect.any(String),
          userCreated: userCredentials.user?.toString() ?? false,
        });
      },
    );
  });
  describe(`Test the ${p("signUp")} endpoint`, () => {
    it.each`
      username         | password
      ${undefined}     | ${undefined}
      ${undefined}     | ${"PASSWORD123"}
      ${"USERNAME123"} | ${undefined}
      ${"U"}           | ${"PassWord123"}
      ${"USERNAME123"} | ${"PASSWORD123"}
    `(
      "It should respond the POST method with a 400, when the body payload is invalid",
      async ({ username, password }) => {
        const responsePayload = { message: "" };
        if (username === undefined) {
          responsePayload.message = "username is required";
        }
        if (password === undefined) {
          responsePayload.message = "password is required";
        }
        if (typeof password === "string" && typeof username === "string") {
          responsePayload.message = "password is invalid";
        }
        if (typeof username === "string" && username.length === 1) {
          responsePayload.message =
            "username is too short - 2 characters minimum";
        }
        const response = await request(app)
          .post(p("signUp"))
          .send({ username, password });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(responsePayload);
      },
    );

    it("It should respond the POST method with a 409, when an existing credential is found", async () => {
      const userCredentials = MOCKED_CREDENTIALS[0];
      mockingoose(Credential).toReturn(userCredentials, "findOne");
      const response = await request(app).post(p("signUp")).send({
        username: userCredentials.username,
        password: userCredentials.password,
      });
      expect(response.statusCode).toBe(409);
      expect(response.body).toEqual({ message: "username already exists" });
    });

    it.each`
      userCredentials
      ${MOCKED_CREDENTIALS[0]}
      ${MOCKED_CREDENTIALS[1]}
      ${MOCKED_CREDENTIALS[2]}
    `(
      "It should respond the POST method with a 201 when username and password are correct",
      async ({ userCredentials }) => {
        mockingoose(Credential).toReturn(null, "findOne");
        const response = await request(app).post(p("signUp")).send({
          username: userCredentials.username,
          password: userCredentials.password,
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual<{
          token: string;
        }>({
          token: expect.any(String),
        });
      },
    );
  });
});
