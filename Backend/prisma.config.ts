import "dotenv/config";
import { defineConfig } from "prisma/config";

function fixEnvForMigrations() {
  let url = process.env["DIRECT_URL"] || process.env["DATABASE_URL"] || "";
  if (!url) return;

  const match = url.match(/postgres\.([a-z0-9]+):/i);
  const projectRef = match ? match[1] : "";

  url = url.replace(/db\.[a-z0-9]+\.supabase\.co/gi, "aws-0-ap-southeast-1.pooler.supabase.com");
  url = url.replace(":6543", ":5432");
  url = url.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "").replace("pgbouncer=true", "");

  if (projectRef && !url.includes("options=reference")) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}options=reference%3D${projectRef}`;
  }

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




