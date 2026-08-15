// prisma.js

require("dotenv").config({ override: true });

const { PrismaClient } = require("../generated");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL in your environment. Add it to .env before starting the server.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
