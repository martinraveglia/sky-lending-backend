import { isBoom } from "@hapi/boom";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import paths from "./constants/paths";
import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(paths.base, router);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const { message = "Oops! Something went wrong" } = error;
  let statusCode = 500;

  if (isBoom(error)) statusCode = error.output.statusCode;

  return res.status(statusCode).json({
    message,
  });
});

export default app;
