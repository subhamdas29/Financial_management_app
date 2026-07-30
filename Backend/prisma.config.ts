import "dotenv/config";
import { defineConfig } from "prisma/config";

function fixEnvForMigrations() {
  let url = process.env["DIRECT_URL"] || process.env["DATABASE_URL"] || "";
  if (!url) return;

  const DEFAULT_REF = "mrxtkfvwchtafvtqzhtc";

  // Extract project reference ID
  let projectRef = DEFAULT_REF;
  const hostMatch = url.match(/db\.([a-z0-9]+)\.supabase\.co/i);
  const userMatch = url.match(/postgres\.([a-z0-9]+):/i);

  if (hostMatch && hostMatch[1]) {
    projectRef = hostMatch[1];
  } else if (userMatch && userMatch[1]) {
    projectRef = userMatch[1];
  }

  // Replace direct IPv6 hostname with IPv4 pooler hostname
  url = url.replace(/db\.[a-z0-9]+\.supabase\.co/gi, "aws-0-ap-southeast-1.pooler.supabase.com");

  // Ensure username is postgres.<projectRef> for Supabase pooler
  if (!url.includes(`postgres.${projectRef}:`)) {
    url = url.replace(/postgres\.[a-z0-9]+:/gi, `postgres.${projectRef}:`);
    url = url.replace(/postgres:/gi, `postgres.${projectRef}:`);
  }

  // Use port 5432 for Session Mode
  url = url.replace(":6543", ":5432");

  // Remove pgbouncer query parameters
  url = url.replace("?pgbouncer=true", "")
           .replace("&pgbouncer=true", "")
           .replace("pgbouncer=true", "");

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





