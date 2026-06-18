import { z } from "zod";

export const tokenSchema = z.object({
  name: z.string().min(1, "Name is required").max(30, "Name is too long"),
  symbol: z.string().trim().min(1).max(10).regex(/^[A-Z0-9]+$/, "Symbol must be uppercase alphanumeric"),
  imageUrl: z.url().startsWith("https://", "Must be a secure URL").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  decimals: z.number().int().min(0).max(9, "Decimals must be between 0 and 9"),
});

export type TokenValues = z.infer<typeof tokenSchema>;