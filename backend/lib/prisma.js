import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    try {
      const pool = new pg.Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter, log: ["error"] });
    } catch (e) {
      console.warn("PrismaPg adapter fallback to standard PrismaClient:", e.message);
      return new PrismaClient({ log: ["error"] });
    }
  }
  return new PrismaClient({ log: ["error"] });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
