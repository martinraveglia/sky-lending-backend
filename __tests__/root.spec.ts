import request from "supertest";

import paths from "@/constants/paths";

import app from "../src/app";

describe("Test root path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get(paths.base);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Sky Lending Server");
  });
});
