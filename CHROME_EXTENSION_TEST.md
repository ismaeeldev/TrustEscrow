# 🛡️ TrustEscrow Chrome Extension: Test Guide

This guide explains how to install and test the "Anywhere" Escrow feature.

---

## 🏗️ 1. Installation

1.  Open **Google Chrome**.
2.  Navigate to `chrome://extensions/`.
3.  Enable **"Developer mode"** (top right toggle).
4.  Click **"Load unpacked"**.
5.  Select the `chrome-extension` folder located in your project root.

---

## 🧪 2. End-to-End Test Flow

### Step A: Start the Backend
Ensure your Next.js app is running locally:
```bash
npm run dev
```

### Step B: Visit any Store
Visit any e-commerce site (e.g., [Amazon](https://www.amazon.com) or a [Shopify Demo Store](https://stockholm-theme-modern.myshopify.com/)).

1.  Navigate to a **Product Page**.
2.  Wait 2 seconds; a green **"🛡️ Secure with TrustEscrow"** button should appear below the main "Add to Cart" button.
3.  Click the button.

### Step C: Complete the Escrow Hold
1.  The **TrustEscrow Side Panel** will open on the right.
2.  Enter your email and review the price (automatically detected).
3.  Click **"Confirm & Hold Funds"**.
4.  The system calls `api/extension/proxy-order`.
5.  You will see a **Virtual Card** generated for you.

### Step D: The "Zero Permission" Release
In a real scenario, the user would use that card on the store checkout. For testing:
1.  Once you have the virtual card, click **"Simulate Delivery (Testing)"** at the bottom of the side panel.
2.  This calls `api/extension/verify-delivery`.
3.  Check your **Admin Dashboard** (`/admin`) or the database; the order status should now be **RELEASED**, and the funds captured in Stripe.

---

## 🛠️ Technical Verification

### 1. Database Check
Run `npx prisma studio` and look at the `orders` table.
*   `status` should move from `FUNDS_HELD` to `RELEASED`.
*   `stripePaymentIntentId` should be populated.

### 2. Stripe Verification
Check your [Stripe Dashboard](https://dashboard.stripe.com/test/payments).
*   You should see a payment authorized (Held) but not captured.
*   Upon clicking "Simulate Delivery," the payment status should change to **Captured**.

---

## 📝 Important Notes
*   **Virtual Cards**: The current implementation uses a "Mock" virtual card generator. To use real cards, you must enable **Stripe Issuing** in your Stripe Dashboard and update the `_generateVirtualCard` method in `services/extension.service.ts`.
*   **CORS**: Ensure your Next.js server allows requests from `chrome-extension://...` if you encounter blocked requests.

---

## 🛠️ Troubleshooting: "Button Not Showing"

If you don't see the green button:

1.  **Reload the Extension**: Go to `chrome://extensions/` and click the **Reload** (circular arrow) icon on the TrustEscrow card.
2.  **Check the Console**: Right-click the store page -> **Inspect** -> **Console**.
    *   Do you see `🛡️ TrustEscrow Anywhere Active`?
    *   Do you see `🛡️ TrustEscrow: Found target button`?
3.  **Refresh the Page**: Some sites use heavy dynamic loading; a hard refresh (`Ctrl + F5`) can help the script initialize.
4.  **Site Specifics**: Some sites (like Amazon) have complex HTML. I've added specific support for Amazon, but if it still doesn't show, try a different store like a [Shopify Demo](https://stockholm-theme-modern.myshopify.com/products/stockholm-modern-backpack) to verify the core logic.
5.  **Check Permissions**: Ensure "Allow access to file URLs" is ON if you are testing on local HTML files.
