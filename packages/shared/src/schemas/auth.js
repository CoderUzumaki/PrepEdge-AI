import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

export const loginSchema = z.object({});
