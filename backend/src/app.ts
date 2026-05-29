import express from "express";
import type { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import v1Router from "./routes/index.js";
import { ApiError } from "./utils/ApiError.js";
import logger from "./utils/logger.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "OK", message: "Backend is running correctly" });
});

app.use("/api/v1", v1Router);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  logger.error(err);
  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
});

export default app;
export { server, io };
