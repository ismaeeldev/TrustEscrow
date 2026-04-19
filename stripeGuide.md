# 💳 Beginner's Guide: Stripe in TrustEscrow

Welcome! If you are new to Stripe, don't worry. This guide will explain exactly how Stripe works in this project and how to get everything set up in 5 minutes.

---

## 🌟 1. What is Stripe?
Stripe is the "bank" for your app. It handles the credit cards so you don't have to touch sensitive data.
- **Publishable Key**: Safe to share (starts with `pk_test`). It tells the browser where to send credit card info.
- **Secret Key**: **KEEP THIS PRIVATE** (starts with `sk_test`). This allows your server to talk to Stripe's server.
- **Webhooks**: This is how Stripe tells your app "Hey, the user just paid!"

---

## 🔑 2. How to get your Keys
1.  **Sign Up**: Go to [Stripe.com](https://stripe.com) and create a free account.
2.  **Test Mode**: Make sure the "Test Mode" toggle is **ON** (top right). Always test before using real money!
3.  **Get Keys**: Go to **Developers > API Keys**.
    -   Copy **Publishable key** to `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env`.
    -   Copy **Secret key** to `STRIPE_SECRET_KEY` in `.env`.

---

## 🪝 3. Understanding Webhooks (The "Magic" Link)
In an Escrow app, we only update the order to **"FUNDS HELD"** after we are 100% sure the money reached Stripe. Webhooks are the "phone call" from Stripe to your app.

### How to set it up locally:
1.  **Install Stripe CLI**: Download it from [Stripe's website](https://stripe.com/docs/stripe-cli).
2.  **Login**: Run `stripe login` in your terminal.
3.  **Forward Events**: Run this command:
    ```bash
    stripe listen --forward-to localhost:3000/api/stripe/webhook
    ```
4.  **Get Secret**: The CLI will print a message: `Your webhook signing secret is whsec_...`.
5.  **Add to Env**: Copy that `whsec_...` value to `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## 💳 4. How to Test Payments
You don't need a real credit card. Use the **Stripe Test Card**:
-   **Number**: `4242 4242 4242 4242`
-   **Expiry**: Any future date (e.g., `12/30`)
-   **CVC**: Any 3 digits (e.g., `123`)

---

## 📂 5. Where the Stripe code lives in this project
-   **Configuration**: `lib/stripe.ts` (Initializes the Stripe tool).
-   **Checkout Logic**: `services/order.service.ts` (Creates the payment page link).
-   **Webhook Handler**: `app/api/stripe/webhook/route.ts` (Receives the "User Paid" confirmation).
-   **Business Logic**: `services/webhook.handler.ts` (Updates the database and ledger).

---

## ⚡ 6. Quick Checklist for Success
- [ ] My `STRIPE_SECRET_KEY` starts with `sk_test`.
- [ ] My `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_test`.
- [ ] I have the Stripe CLI running (`stripe listen`) when I test payments.
- [ ] I see `FUNDS_HELD` in my database after a successful payment.

> [!TIP]
> **Pro Tip**: In a real production environment, you will create a "Webhook Endpoint" in the Stripe Dashboard under **Developers > Webhooks** and point it to your live domain (e.g., `https://your-escrow-app.com/api/stripe/webhook`).
