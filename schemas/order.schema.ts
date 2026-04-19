import { z } from "zod";

export const CreateOrderSchema = z.object({
  buyer_email: z.string().email("Invalid email format"),
  amount: z.number().positive("Amount must be greater than zero"),
  seller_email: z.string().email("Invalid seller email format").optional(),
  seller_stripe_account_id: z.string().optional(),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
