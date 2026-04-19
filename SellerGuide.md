# 🛡️ Seller's Guide: How to Connect & Get Paid with TrustEscrow

Welcome to the TrustEscrow Seller Network! We use a state-of-the-art **Hold-and-Release** system to ensure you get paid securely for every transaction. 

This guide will take you from **0 to 100** on how to connect your account and start receiving funds perfectly.

---

## 🚀 Step 1: Access the Onboarding Portal
Everything starts at our secure onboarding link.
1. Open your browser and go to: `http://localhost:3000/onboard`
2. You will see a premium welcome screen designed to get you started in seconds.

## 📧 Step 2: Register Your Business Email
1. Enter the email address you use for your business.
2. Click **"Connect with Stripe"**.
   * *Why Stripe?* We use Stripe Connect (the industry standard) to handle your payouts securely. We never see your bank details; everything is handled safely by Stripe.

## 💳 Step 3: The Stripe Onboarding (Magic Step)
You will be redirected to the secure Stripe portal.
1. **In Test Mode**: You can click **"Skip this form"** at the top to instantly activate your account.
2. **In Production**: You would enter your business details and bank account/debit card where you want to receive your money.
3. Once finished, Stripe will send you back to our **Success Page**.

## ✅ Step 4: Get Your Seller ID
1. On the success page, you will see a unique code starting with `acct_...` (e.g., `acct_1XXXXXXXXXXX`).
2. **This is your Private Seller ID.** 
3. **Important**: Copy this ID and keep it safe! You (or your automated bot) will needs this ID whenever you create a new Escrow Order.

---

## 💰 How the Payment Flow Works (The "0 to 100")

1. **Order Created**: A buyer initiates an order. We tell them exactly how much to pay.
2. **Funds Held**: The buyer pays. Our system puts the money in a "Digital Vault." You will see the status change to **FUNDS HELD** in your dashboard.
3. **Delivery**: You deliver the product or service.
4. **Submit Proof**: You (or your bot) send us a tracking number or delivery link via the API.
5. **Release**: Our Admin reviews the proof. If it looks good, they hit **"Release Funds"**.
6. **Payout**: The money is instantly moved from our vault to **Your Stripe Account**. 

---

## 🛠️ Troubleshooting for Beginners

- **"Account Restricted"**: This usually means Stripe needs more info (like a photo ID). In our testing environment, you can just click "Skip" to bypass this.
- **"Where is my money?"**: Funds only leave Escrow once the Admin clicks "Release". Check the **Ledger Audit Trail** on your order page to see exactly when the transfer happened.

> [!TIP]
> **Pro Tip**: Use our automated APIs to create orders and submit proof. This removes the manual work and gets you paid even faster!

---
*&copy; 2026 TrustEscrow Systems Logic | Secure. Automated. Trusted.*
