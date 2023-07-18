import cors from "cors";
import express from "express";

const app = express();

app.use(cors());

app.get("/", (_, res) => {
  res.send("Sky Lending Server");
});

export default app;
