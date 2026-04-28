"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for messages from the parent (extension sidepanel)
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.action === "submit_payment") {
        if (!stripe || !elements) return;

        const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: event.data.email,
          },
        });

        if (stripeError) {
          setError(stripeError.message || "Payment failed");
          window.parent.postMessage({ action: "payment_failed", error: stripeError.message }, "*");
        } else {
          window.parent.postMessage({ action: "payment_success", payment_method_id: paymentMethod.id }, "*");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [stripe, elements]);

  return (
    <div style={{ padding: "10px", background: "transparent" }}>
      <div style={{
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)"
      }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": {
                  color: "#94a3b8",
                },
              },
              invalid: {
                color: "#ef4444",
              },
            },
          }}
        />
      </div>
      {error && <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>{error}</div>}
      <style jsx global>{`
        body { margin: 0; background: transparent; overflow: hidden; }
      `}</style>
    </div>
  );
}

export default function EmbedCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
