import { execSync } from "child_process";
import server from "../src/server";
import dotenv from "dotenv";
import { beforeAll, afterAll, beforeEach, afterEach } from "@jest/globals";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient(
  {
    log : ['query', 'info', 'warn', 'error']
  }
);

// Set the NODE_ENV to test
dotenv.config({ path: ".env.test" });

console.log('Tests running in environment: '+ process.env.NODE_ENV)
beforeAll(async() => {
  console.log("Resetting and migrating test database...");
  execSync("dotenv -e .env.test -- npx prisma migrate reset --force --skip-seed", { stdio: "inherit" });
  await prisma.$connect();
})

afterAll(async() => {
  await prisma.$disconnect();
  console.log('prisma disconnected')
  server.close(); // Stop the server after tests
});
