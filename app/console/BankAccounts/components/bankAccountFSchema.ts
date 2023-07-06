import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const bankAccFSchema = z.object({
  client: z
    .object({
      _id: z.string().min(2, { message: "Client invalid" })
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
      _id: z.string().min(2, { message: "Account Type invalid" })

    }),
});

export const bankAccFResolver = zodResolver(bankAccFSchema);

export default bankAccFSchema;
export type bankAccFType = z.infer<typeof bankAccFSchema>;
