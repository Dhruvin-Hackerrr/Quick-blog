import app from "./app.js";
import connectDB from "./config/database.js";
import "dotenv/config";

const port = Number(process.env.PORT) || 5000;

/* -----------------------------
   1. Handle uncaught exceptions
------------------------------*/
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  process.exit(1);
});

/* -----------------------------
   2. Handle unhandled rejections
------------------------------*/
process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason);
  process.exit(1);
});

async function start(): Promise<void> {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log(
        `Server is running on port ${port} in ${process.env.NODE_ENV || "development"} mode`
      );
    });

    /* -----------------------------
       Optional: graceful shutdown
    ------------------------------*/
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

start();