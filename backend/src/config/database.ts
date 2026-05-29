import { PrismaClient } from "@prisma/client"
import logger from "../utils/logger.js";

export const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("PostgreSQL connected via Prisma");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Database connection error: ${error.message}`);
    } else {
      logger.error("Unknown database connection error");
    }
    process.exit(1);
  }
};

export default connectDB;
