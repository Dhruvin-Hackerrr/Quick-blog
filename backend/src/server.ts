import { server } from "./app.js";
import connectDB from "./config/database.js";
import "dotenv/config";
import { initSocket } from "./modules/socket/socket.js";
import logger from "./utils/logger.js";

const port = Number(process.env.PORT) || 5000;

/* -----------------------------
   1. Handle uncaught exceptions
------------------------------*/
process.on("uncaughtException", (err) => {
  logger.error(`🔥 Uncaught Exception:, ${err}`);
  process.exit(1);
});

/* -----------------------------
   2. Handle unhandled rejections
------------------------------*/
process.on("unhandledRejection", (reason) => {
  logger.error(`🔥 Unhandled Rejection: , reason`);
  process.exit(1);
});

async function start(): Promise<void> {
  try {
    await connectDB();

    initSocket()

    const portInit = server.listen(port, () => {
      logger.info(
        `Server is running on port ${port} in ${process.env.NODE_ENV || "development"} mode`
      );
    });

    /* -----------------------------
       Optional: graceful shutdown
    ------------------------------*/
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down gracefully...");
      portInit.close(() => {
        process.exit(0);
      });
    });

  } catch (err) {
    logger.error(`Error starting server:, ${err}`);
    process.exit(1);
  }
}

start();