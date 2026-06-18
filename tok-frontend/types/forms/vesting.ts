import { z } from "zod";

export interface VestingValidationConfig {
  maxBalanceRaw: number;
  decimals: number;
}

export const createVestingSchema = (config: VestingValidationConfig) => {
  const maxHumanBalance = config.maxBalanceRaw;

  return z
    .object({
      depositAmount: z
        .number({ invalid_type_error: "Deposit amount is required" })
        .positive("Deposit amount must be greater than 0")
        .max(maxHumanBalance, `Insufficient balance. Maximum available is ${maxHumanBalance}`),
      cliffTime: z
        .preprocess(
          (val) => (val === "" || val === undefined || isNaN(Number(val)) ? 0 : Number(val)),
          z.number({ invalid_type_error: "Cliff duration must be a number" }).min(0, "Cliff duration cannot be negative")
        ),
      releaseAmount: z
        .number({ invalid_type_error: "Release amount is required" })
        .positive("Release amount must be greater than 0"),
      releasePeriod: z
        .number({ invalid_type_error: "Release period is required" })
        .positive("Release period must be greater than 0"),
      recipient: z
        .string()
        .nonempty("Recipient address is required")
        .regex(/^0x[a-fA-F0-9]{64}$/, "Invalid Sui address format"),
    })
    .refine((data) => {
      if (data.depositAmount === undefined || data.releaseAmount === undefined) return true;
      return data.releaseAmount <= data.depositAmount;
    }, {
      message: "Release amount per period cannot be greater than the total deposited amount",
      path: ["releaseAmount"],
    });
};

export type VestingValues = z.infer<ReturnType<typeof createVestingSchema>>;