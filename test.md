# TrustEscrow System: Complete End-to-End Testing Guide

This guide is designed to help you test the **Entire Multi-Persona Workflow** (Seller Onboarding + Buyer Payment + Admin Release). 

---

## 🎭 The Personas
1. **The Seller**: Needs to connect their account to get paid.
2. **The Buyer**: Needs to pay for the secure order.
3. **The Admin**: Needs to verify delivery and release the funds.

---

## 🛠️ Step 0: Initial Environment Setup

1. **Stripe Keys**: Ensure `.env` has `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `ADMIN_SECRET`.
2. **Webhook Listener**: Start the Stripe CLI to listen for events:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_...` key from the terminal and update `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## 🔗 Step 1: [Seller Persona] - Automated Onboarding
*Test that a seller can self-provision an account.*

1. Open your browser to `http://localhost:3000/onboard`.
2. Enter a test email (e.g., `test-seller@trustescrow.com`).
3. Click **Connect with Stripe**.
4. In the Stripe Test portal, click **"Skip this form"** at the top.
5. You will arrive at the **Onboarding Success** page.
6. **PRO TIP**: Copy your **Private Seller ID** (e.g., `acct_...`). You'll need this to get paid!


---

## 🏃 Step 2: Order Generation (Bot/API Simulator)

Simulate a marketplace bot creating an escrow order:

**Windows (PowerShell):**
```powershell
# Run this to get the FULL Checkout URL immediately:
(Invoke-RestMethod -Uri "http://localhost:3000/api/orders/create" -Method Post -Headers @{"Content-Type"="application/json"} -Body (@{ buyer_email="buyer@example.com"; amount=8500; seller_email="seller-test@example.com"; seller_stripe_account_id="acct_1TNcoXLNkHiM1da5
" } | ConvertTo-Json)).checkout_url
```

**Mac/Linux (Bash):**
```bash
curl -X POST http://localhost:3000/api/orders/create \
-H "Content-Type: application/json" \
-d '{"buyer_email":"buyer@example.com", "amount": 8500, "seller_email":"seller-test@example.com", "seller_stripe_account_id": "PASTE_YOUR_ACCT_ID_HERE"}'
```

The API will return an `order_id` and a `checkout_url`. **Copy the `order_id`**.

---

## 💳 Step 3: The Buyer Journey

1. Open the `checkout_url` in your browser.
2. Click **Pay Now**.
3. Use the test card: `4242 4242 4242 4242`, any future date, and any CVC (`123`).
4. You will be redirected to the Order Status page.
5. Verify the banner is **Green (Payment Successful)** and status is **FUNDS HELD**.

---

## 📦 Step 4: Submitting Delivery Proof

The seller must prove delivery before funds can be released.

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/orders/YOUR_ORDER_ID/submit-proof" -Method Post -Headers @{"Content-Type"="application/json"} -Body (@{ deliveryProof="https://tracking.example.com/id/12345" } | ConvertTo-Json)
```

**Mac/Linux (Bash):**
```bash
curl -X POST http://localhost:3000/api/orders/YOUR_ORDER_ID/submit-proof \
-H "Content-Type: application/json" \
-d '{"deliveryProof":"https://tracking.example.com/id/12345"}'
```

---

## 👑 Step 5: Admin Review & Fund Release

1. Go to `http://localhost:3000/admin`.
2. It should redirect you to `/admin/login`. Enter your `ADMIN_SECRET` (e.g., `super-secret-admin-key`).
3. You will land on the **Orders Dashboard**.
4. Click the **View** (Eye icon) on your order.
5. Verify the **Delivery Proof URL** is visible.
6. Click the green **Release Funds** button.
7. Result: The status changes to **RELEASED**, and a `DEBIT` ledger entry appears. Stripe will now transfer the funds to the seller's account.

🎉 **Test sequence complete!**

