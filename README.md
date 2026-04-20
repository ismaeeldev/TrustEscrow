# 🛡️ TrustEscrow: The Sovereign Escrow Forge

**Developed by Muhammad Ismaeel**

TrustEscrow is a premium, high-fidelity Escrow infrastructure built for modern digital commerce. It provides a secure "Hold-and-Release" logic that protects both buyers and sellers through an immutable ledger and a dedicated Auditor Control Center.

---

## 💎 Project Objectives

*   **Maximum Trust**: Funds are captured via Stripe and held in a secure platform balance until delivery is verified.
*   **Auditor Oversight**: A proprietary "Order Forge" dashboard allows administrators to examine transactions and authorize releases with precision.
*   **Immutable Ledger**: Every financial movement (Credit/Debit) is synchronized to a Neon Serverless PostgreSQL database with detailed audit trails.
*   **Real-time Intelligence**: High-fidelity UI with auto-syncing status trackers and performance-optimized skeletons.

---

## 🛠️ Technology Stack

- **Core**: Next.js 16 (App Router)
- **Database**: Prisma ORM with Neon (Serverless Postgres)
- **Payments**: Stripe Connect (Standard Onboarding) & Checkout Sessions
- **UI/UX**: Tailwind CSS, Shadcn UI, Framer Motion (Animations)
- **Monitoring**: Redundant Metadata Tagging & Webhook Synchronization

---

## 🚀 Key Features

### 🏢 The Order Forge (Admin Dashboard)
A bento-grid inspired dashboard for administrators to orchestrate secure escrow transactions.
- **Transaction Ledger**: Center-aligned, responsive data grid.
- **Sovereign Sync**: Real-time revalidation of all ledger states.
- **Intelligence Stats**: Live tracking of Page Volume, Active Status, and Settlement Rates.

### 🛡️ Auditor Control Center (Order Detail)
A high-fidelity interface for examining individual transactions.
- **Verification Module**: Direct links to delivery proof with high-attention alerts for missing metadata.
- **Authorization Hub**: confirm fund release with glowing feedback and safety confirmation loops.

### 🔄 Status Tracker (Buyer View)
A client-side polling system that ensures the UI reflects the real-time state of the transaction immediately after payment success.

### 🤝 Seller Onboarding
A specialized portal for sellers to link their payout accounts via Stripe Connect.

---

## 📝 Configuration

Ensure the following environment variables are set in `.env`:

```env
DATABASE_URL="your-neon-postgres-url"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🔧 Installation

```bash
# Install dependencies
npm install

# Push database schema
npx prisma db push

# Launch the Forge
npm run dev
```

---

### 🏛️ Developed by Muhammad Ismaeel
*Focusing on Premium UI, Immutable Logic, and Stable Financial Infrastructure.*
