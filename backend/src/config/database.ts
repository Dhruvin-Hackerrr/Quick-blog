import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected via Prisma");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Database connection error: ${error.message}`);
    } else {
      console.error("Unknown database connection error");
    }
    process.exit(1);
  }
};

export default connectDB;
