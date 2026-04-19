# 🛠️ Integration Guide: TrustEscrow API for Developers

Welcome to the TrustEscrow Developer Portal. This guide explains how to programmatically integrate our escrow infrastructure into your e-commerce store, marketplace, or automated bot.

---

## 🏗️ 1. Architecture Overview
TrustEscrow is an **API-First** platform. You create an order on our server, redirect your customer to our secure checkout, and we handle the payout logic automatically.

---

## 🔑 2. Prerequisites
Before you begin, ensure you have:
1. A **Seller ID** (starts with `acct_...`). You can generate this at `/onboard`.
2. Our API endpoint URL (e.g., `https://your-escrow-app.com`).

---

## 🛒 3. Creating an Escrow Order
When your customer clicks "Buy Now" on your site, your backend should call our `create` API.

**Endpoint**: `POST /api/orders/create`

**Request Body (JSON)**:
```json
{
  "buyer_email": "customer@example.com",
  "amount": 5000, 
  "seller_email": "you@yourdomain.com",
  "seller_stripe_account_id": "acct_1XXXXXXXXXXXXXXX"
}
```
*Note: `amount` must be in cents (e.g., 5000 = $50.00).*

**Success Response**:
```json
{
  "order_id": "9eac8f47-eee9-433c-a8a5-ffe465f08aff",
  "checkout_url": "http://localhost:3000/pay/9eac8f47..."
}
```
**Action**: Redirect your user to the `checkout_url`.

---

## 📦 4. Submitting Delivery Proof
Once you have shipped the item or performed the service, you must notify the TrustEscrow system so the Admin can release your funds.

**Endpoint**: `POST /api/orders/{order_id}/submit-proof`

**Request Body (JSON)**:
```json
{
  "deliveryProof": "https://tracking.fedex.com/id/987654321"
}
```

**Success Response**:
```json
{ "success": true }
```

---

## 🛰️ 5. Monitoring Order Status
Your e-commerce site can poll our status API to see if the buyer has paid or if funds have been released.

**Endpoint**: `GET /api/orders/{order_id}`

---

## 🔒 6. Production Security Checklist
To ensure your integration is secure, follow these best practices:

1. **Server-Side Only**: Never call the `create` API from the frontend browser. This prevents users from tampering with the `amount`. Always call it from your Node.js/Python/PHP backend.
2. **Webhooks**: Configure a webhook listener on your site to receive `FUNDS_HELD` events from our system so you can start processing the order immediately.
3. **Admin Monitoring**: Log into the `/admin` portal daily to review pending releases and ledger audit trails.

---

## 📋 7. Example Webhook Flow (E-commerce)
1. User checks out on **Your-Site.com**.
2. **Your-Site** calls TrustEscrow `POST /create`.
3. User pays at TrustEscrow Checkout.
4. TrustEscrow receives payment -> sets status to `FUNDS_HELD`.
5. TrustEscrow notifies **Your-Site** via webhook.
6. **Your-Site** ships the product.
7. **Your-Site** calls TrustEscrow `POST /submit-proof`.
8. Admin releases funds -> You get paid.

---
*Questions? Reach out to your account manager or visit our Developer Discord.*
