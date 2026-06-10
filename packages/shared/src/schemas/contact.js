import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  message: z.string().min(10).max(5000),
});
