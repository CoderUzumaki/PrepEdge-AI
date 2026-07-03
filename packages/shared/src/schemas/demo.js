import { z } from "zod";

export const sampleAnswerSchema = z.object({
  answer: z.string().min(10, "Answer must be at least 10 characters").max(3000),
});
