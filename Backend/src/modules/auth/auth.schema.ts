import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];

/** 
 * z.infer "steals" the TypeScript type directly from the Zod schema 
 * this keeps the zod rules and ts code types perfectly synced
 * if I change a rule in the schema like password length from 8 to 10, this type updates automatically
 * I added ['body'] at the end to only grab the type for the request body data
 */