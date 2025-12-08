# TrackWash Pro 🚗🫧  
x402-Powered Consumer Car Care & Payments on Avalanche

> Established in 2025. Own your car. Love your car <3

---

## 1. Overview

**TrackWash Pro** is a consumer-focused car care and payments platform for:

- **Car owners** – track all your cars, washes, and maintenance history in one place.
- **Car wash & garage owners** – manage branches, operators, payments, and loyalty.
- **Operators** – earn commissions for every wash/service you complete.
- **Managers** – monitor branch performance and staff activity in real time.

It is built for the **Hack2Build: Payments x402 edition** and showcases:

- **x402 payment infrastructure on Avalanche**  
- **Core Wallet** + stablecoin payments (AVAX, USDC, etc.)  
- **Dual loyalty system** (customers + operators)  
- **Kite AI-powered “Mechanic” assistant** for education and troubleshooting  
- **Beautiful, responsive UX** with car wash imagery (including Black people for authenticity and representation)

---

## 2. Problem & Vision

Car owners often:

- Lose track of **when** a car was last serviced.
- Forget **which garage** did what.
- Have **no unified history** across car washes and maintenance.
- Lack reliable access to a **mechanic** when issues arise.

Service providers (car washes / garages):

- Struggle with **loyalty tracking**, **operator performance**, and **modern payments**.
- Use fragmented tools for messaging, payments, and CRM.

**TrackWash Pro** solves this by combining:

- A **car maintenance tracker** + **car wash tracker**  
- **x402-based payments** on Avalanche  
- **Automated loyalty for customers and operators**  
- A **Kite AI Mechanic** that can answer questions 24/7

---

## 3. Key Personas & Use Cases

### 3.1 Personas

- **Owner (Business Owner)** – runs one or more branches (car washes and/or garages).
- **Manager (Branch Manager)** – manages a specific branch, operators, and daily performance.
- **Operator** – staff member who performs washes/services and earns commissions.
- **Customer** – car owner who tracks vehicles, history, and loyalty.

### 3.2 Use Cases

- Owner views **multi-branch performance, revenue, and x402 payments**.
- Manager sees **branch-only metrics**, suspicious spikes, and operator stats.
- Operator starts **new wash/service**, sees **today’s work & earnings**.
- Customer tracks **multiple cars**, sees **history, next due maintenance, and loyalty rewards**.
- Kite AI Mechanic answers **“What does this warning light mean?”**, **“When should I service brakes?”**, etc.

---

## 4. Core Features

### 4.1 Consumer & Vehicle Features

- Register multiple cars (make, model, year, plate, mileage).
- View **per-car timeline** of:
  - Car **washes**
  - Car **maintenance services** (oil change, tires, brakes, etc.)
- Automatic **maintenance rating** per car based on:
  - Timeliness of services
  - Frequency of overdue maintenance
- Automated **“due soon” reminders** (time and mileage based).

### 4.2 Business & Operations

- Multi-branch management (car wash & garage branches).
- Role-based dashboards:
  - **Owner Dashboard** – global KPIs, revenue, loyalty, payments.
  - **Manager Dashboard** – branch-only stats, operators, alerts.
  - **Operator Dashboard (mobile-first)** – new job flow, stats, commissions.
  - **Customer Dashboard** – vehicle list, history, loyalty, rewards.

### 4.3 Loyalty & Rewards

- **Customer Loyalty**:
  - Earn points per wash/service.
  - Configurable rules (e.g., “Every 10 washes = free wash”).
  - Clear progress: “You’re 7/10 towards your free wash.”
- **Operator Rewards**:
  - Automatically earn **points/commissions per completed wash/service**.
  - View **today’s earnings**, **lifetime earnings**, and **upcoming reward milestones**.

### 4.4 Payments (x402 + Stablecoins + Local Rails)

- x402-based HTTP flows:
  - `402 Payment Required` + `X-PAYMENT` headers  
  - Facilitator triggers payment on Avalanche.
  - Backend verifies on-chain settlement before returning `200 OK` and starting/logging the wash/service.
- **Assets**:
  - AVAX
  - Stablecoins (e.g., USDC; structured to support USDT, etc.).
- **Core Wallet integration** for connecting, viewing account, signing payments.
- **M-Pesa integration (stub/sandbox)** for regions where mobile money is dominant.

### 4.5 Kite AI Mechanic

- Integrated **Kite AI** assistant that acts as a **trusted mechanic and service advisor**.
- Uses:
  - Car profile (make/model/year/mileage)
  - Region / usage patterns
  - Service and wash history
  - Maintenance rating and due dates
- Helps car and garage owners:
  - Understand issues (**noises, warning lights, vibrations**)
  - Choose the right service level
  - Plan maintenance schedules
- Follows guardrails for:
  - Safety-first advice
  - Encouraging in-person inspections for critical faults
  - Avoiding legal/medical/insurance advice

---

## 5. x402 & Payments Architecture

TrackWash Pro aligns with the x402 course and starter kit:

- **HTTP 402** + `X-PAYMENT`:
  - When a wash or maintenance service requires payment, API responds with HTTP 402 and `X-PAYMENT` metadata (price, asset, payment_id, callback URIs).
- **Facilitator pattern**:
  - A payment facilitator sponsors gas and settles payments on Avalanche.
  - Uses x402 & optionally thirdweb tooling.
- **On-chain settlement**:
  - Payment records stored (e.g., `PaymentSettlement` / `PaymentRegistry` contract).
  - Each `payment_id` is used once only.
- **Verification**:
  - Backend checks on-chain status before returning 200 OK and starting/logging the service/wash.

References (used during design):

- x402 starter kit  
- x402 Payment Infrastructure course  
- x402 integrations & thirdweb x402 resources  

(Links should be added in the repository’s docs section or a dedicated `docs/` folder.)

---

## 6. System Architecture

The project is organized as a **TypeScript monorepo**:

```bash
trackwash-pro/
├─ apps/
│  ├─ web/              # Next.js 15 (App Router) frontend
│  └─ api/              # Express backend (x402, loyalty, operators, Kite integration)
├─ packages/
│  ├─ domain/           # Shared types, zod schemas, domain logic
│  ├─ core-wallet/      # Core Wallet connection hooks & utilities
│  ├─ payments-x402/    # x402 client, payment helpers, facilitator integration
│  └─ shared-ui/        # (optional) Shared UI components & theme
├─ .env.example
├─ package.json
├─ pnpm-lock.yaml (or package-lock.json)
└─ README.md

Frontend (apps/web)
	•	Next.js 15 with App Router
	•	TypeScript
	•	Responsive design (mobile-first, tablets, desktop)
	•	Avax-inspired UI:
	•	Dark theme
	•	Bold gradients and glassmorphism
	•	Rounded cards and expressive typography
	•	Imagery:
	•	Hero and dashboard images generated via imagi and curated car wash photography.
	•	Includes Black people and diverse users to reflect global usage.

Main Routes & Screens (example)
	•	/ – Home / Landing
	•	Product overview
	•	Role selection (Owner / Manager / Operator / Customer)
	•	Hero images and tagline.
	•	/owner/dashboard
	•	/manager/dashboard
	•	/operator/dashboard
	•	/customer/dashboard
	•	/vehicles/:id
	•	/settings (for configuration, tokens, loyalty rules, etc.)

Backend (apps/api)
	•	Express + TypeScript.
	•	Core endpoints (examples):
	•	/api/auth/* – authentication / session mock.
	•	/api/branches/* – branch CRUD and metrics.
	•	/api/vehicles/* – register vehicles and fetch history.
	•	/api/washes/* – record washes.
	•	/api/services/* – record maintenance services.
	•	/api/loyalty/* – loyalty balances and reward redemptions.
	•	/api/operators/* – operator stats and commissions.
	•	/api/payments/x402/* – pricing, payment initiation, verification.
	•	/api/kite/chat – Kite AI mechanic chat endpoint.

⸻

7. Loyalty & Rewards Model

Customers
	•	Points per wash/service (configurable).
	•	Simple rule: “Every N points = free wash/service.”
	•	Tracking:
	•	Per-car and per-customer.
	•	Per-branch and global.
	•	UI surfaces:
	•	Progress bars and “X of N washes until your free wash”.

Operators
	•	Each completed wash/service credits:
	•	Commission points and/or monetary value.
	•	Operators see:
	•	Today’s total washes/services
	•	Today’s earnings
	•	Lifetime earnings
	•	Next reward milestone

Anti-abuse measures (conceptual):
	•	No double-counting (idempotent API flows).
	•	Basic anomaly detection (too many washes in a short time).

⸻

8. Kite AI Mechanic Integration
	•	System prompt defines the mechanic as:
	•	A certified, friendly, safety-first car mechanic & advisor.
	•	Context injection:
	•	Per-vehicle data (make, model, year, mileage).
	•	Recent services and wash history.
	•	Regional hints (dusty roads, city driving, etc.).
	•	Chat widget:
	•	Accessible from all main dashboards.
	•	“Ask the mechanic about this car” button pre-loads context.
	•	Safety:
	•	Encourages in-person inspection for severe symptoms.
	•	Avoids dangerous DIY instructions.

Use the Kite AI documentation and Hack2Build resources for implementation details (API keys, SDKs, message formats, etc.).

⸻

9. Visual Design & Imagery
	•	Home page and key dashboards use:
	•	Hero images with foam, water, and modern car wash setups.
	•	Close-up shots of cars and tools.
	•	Authentic scenes with Black people and diverse drivers, to reflect real-world usage and regions.
	•	Images are:
	•	Optimized via the framework’s image component (for performance).
	•	Responsive (adapt to small and large screens).
	•	Combined with subtle overlays and gradients for a modern look.

⸻

10. Getting Started

10.1 Prerequisites
	•	Node.js (LTS)
	•	pnpm or npm
	•	(Optional) Access to:
	•	Avalanche testnet RPC
	•	Core Wallet project configuration
	•	Kite AI API key
	•	Any x402/thirdweb sandbox APIs

10.2 Installation

# Clone the repo
git clone <your-repo-url>.git
cd trackwash-pro

# Install dependencies (pnpm recommended)
pnpm install
# or
npm install

10.3 Environment Variables

Copy .env.example to .env and fill in:

# Avalanche / RPC
AVALANCHE_RPC_URL=<your_avalanche_rpc_url>
AVALANCHE_CHAIN_ID=<e.g. 43113 for Fuji>

# Core Wallet / thirdweb
CORE_WALLET_PROJECT_ID=<core_wallet_or_thirdweb_project_id>

# x402
X402_API_BASE_URL=<x402_gateway_or_backend_url>
X402_FACILITATOR_KEY=<facilitator_secret_if_applicable>

# Payments
DEFAULT_PAYMENT_ASSET=AVAX

# Kite AI
KITE_API_KEY=<kite_ai_api_key>

# Any additional secrets as needed

Note: Names are examples – adjust to match your actual implementation.

10.4 Running the App

Example dev commands (adapt to your package.json):

# Run both frontend and backend in dev mode
pnpm dev

# Or individually:
pnpm dev:web   # apps/web
pnpm dev:api   # apps/api

By default, the app is designed to run with:
	•	Frontend (Next.js) available in the browser.
	•	API exposed on the same or adjacent port (e.g., 5000).

⸻

11. Testing

Add tests as needed (examples):
	•	Unit tests for domain logic (packages/domain).
	•	Integration tests for key API flows (x402 payment initiation & verification, recordWash, recordService).
	•	UI smoke tests for main dashboards.

Example command:

pnpm test


⸻

12. Deployment

You can deploy:
	•	Frontend (apps/web) to platforms like Vercel or Netlify.
	•	Backend (apps/api) to services like Render, Fly.io, Railway, etc.

Ensure environment variables are configured for each environment (testnet, staging, production) and that your x402 facilitator endpoints and Core Wallet settings match.

⸻

13. Roadmap

Potential future enhancements:
	•	Deeper M-Pesa and local payment rails integration in production.
	•	Full ERC-8004 AI agent flows for fleet and machine-to-machine payments.
	•	Push notifications (mobile/web) for “maintenance due soon”.
	•	More advanced analytics dashboards for multi-country deployments.
	•	Richer CRM and campaign tooling for business owners.

⸻

14. Contributing

Contributions are welcome!
	•	Fork the repo.
	•	Create a feature branch: git checkout -b feature/my-feature.
	•	Commit your changes with clear messages.
	•	Open a pull request describing:
	•	What you changed.
	•	Why it matters.
	•	How to test it.

⸻

15. License

Choose a license appropriate for your use case, for example:
	•	MIT License￼
(Add a LICENSE file to the root of the repo.)

⸻

16. Acknowledgements
	•	Avalanche and the Hack2Build: Payments x402 edition organizers.
	•	The x402 team for the payment infrastructure course and starter kit.
	•	Kite AI for the mechanic assistant infrastructure.
	•	Everyone building better tools for car owners, operators, and garages worldwide.

Established in 2025. Own your car. Love your car <3

