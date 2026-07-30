import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL environment variable is required"),
  DIRECT_URL: z.string().optional(),
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string().min(1).default("fallback_jwt_access_secret_key_financial_app_2026"),
  JWT_REFRESH_SECRET: z.string().min(1).default("fallback_jwt_refresh_secret_key_financial_app_2026"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid Environment Variables:");
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsed.data;
