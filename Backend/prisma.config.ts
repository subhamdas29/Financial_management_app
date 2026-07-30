import "dotenv/config";
import { defineConfig } from "prisma/config";

function getMigrationUrl(): string {
  if (process.env["DIRECT_URL"]) {
    return process.env["DIRECT_URL"];
  }
  const dbUrl = process.env["DATABASE_URL"] || "";
  return dbUrl
    .replace(":6543", ":5432")
    .replace("?pgbouncer=true", "")
    .replace("&pgbouncer=true", "");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getMigrationUrl(),
  },
});

