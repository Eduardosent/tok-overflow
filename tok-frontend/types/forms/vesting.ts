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
        .number()
        .positive("Deposit amount must be greater than 0")
        .max(maxHumanBalance, `Insufficient balance. Maximum available is ${maxHumanBalance}`),
      cliffTime: z
        .preprocess(
          (val) => (val === "" || val === undefined || isNaN(Number(val)) ? 0 : Number(val)),
          z.number().min(0, "Cliff duration cannot be negative")
        ),
      releaseAmount: z
        .number()
        .positive("Release amount must be greater than 0"),
      releasePeriod: z
        .number()
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
    }) as any;
};

export type VestingValues = {
  depositAmount: number;
  cliffTime: number;
  releaseAmount: number;
  releasePeriod: number;
  recipient: string;
};