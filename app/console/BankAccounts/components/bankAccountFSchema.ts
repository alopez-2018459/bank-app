import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const bankAccFSchema = z.object({
  accNumber: z
    .string()
    .min(8, { message: "Name is too short" })
    .max(30, { message: "Name is too long" }),
  client: z
    .object({
      _id: z.string()
    }),
  currency: z
    .enum(["USD", "GTQ", "EUR"], {
    errorMap: (issue, ctx) => {
      return { message: "Must be USD, GTQ or EUR" };
    },
  }).transform(String),
  balance: z
    .string({ required_error: "Invalid Amount" })
    .regex(/^\d+$/),
  accountType: z
    .object({
      _id: z.string()

    }),
});

export const bankAccFResolver = zodResolver(bankAccFSchema);

export default bankAccFSchema;
export type bankAccFType = z.infer<typeof bankAccFSchema>;
