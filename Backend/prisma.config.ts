import "dotenv/config";
import { defineConfig } from "prisma/config";

function getMigrationUrl(): string {
  let url = process.env["DIRECT_URL"] || process.env["DATABASE_URL"] || "";
  // Convert direct IPv6 host db.<ref>.supabase.co to IPv4 pooler host
  url = url.replace(/db\.[a-z0-9]+\.supabase\.co/gi, "aws-0-ap-southeast-1.pooler.supabase.com");
  // Use port 5432 for Session Mode (supports migrations over IPv4)
  url = url.replace(":6543", ":5432");
  // Remove pgbouncer parameters
  url = url.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "").replace("pgbouncer=true", "");
  return url;
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


