import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().min(1, "Email is required").transform((val) => val.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters").max(50, "Password is too long"),
  validate: z.string().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;