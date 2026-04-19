export interface CreateOrderInput {
  buyer_email: string;
  amount: number; // in cents
}

export interface CreateOrderResponse {
  order_id: string;
  checkout_url: string | null;
  status: string;
  message: string;
}
