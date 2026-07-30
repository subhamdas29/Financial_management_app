import "dotenv/config";
import { defineConfig } from "prisma/config";

function fixEnvForMigrations() {
  let url = process.env["DIRECT_URL"] || process.env["DATABASE_URL"] || "";
  if (!url) return;

  url = url.replace(/db\.[a-z0-9]+\.supabase\.co/gi, "aws-0-ap-southeast-1.pooler.supabase.com");
  url = url.replace(":6543", ":5432");
  url = url.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "").replace("pgbouncer=true", "");

  process.env["DATABASE_URL"] = url;
}

fixEnvForMigrations();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"]!,
  },
});




