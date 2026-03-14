import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

export default defineConfig({
  schema: path.join("src", "backend", "database", "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
