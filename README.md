# 🏦 LendX — DeFi Lending Protocol

> **Aave-style lending, built from scratch.** Deposit ETH as collateral, borrow USDC, watch your health factor in real time, and get liquidated if you're not careful.

🔴 **Live App** → [lendx.niladri.app](https://lendx.niladri.app)  
💻 **Project 2/6 of my [6 Projects in 60 Days](https://twitter.com/dev_niladri) challenge**  
← [Project 1: QuestFi](https://github.com/niladri-gudu/QuestFi)

---

## What is LendX?

LendX is a full-stack DeFi lending protocol — the kind of thing Aave and Compound are built on, but built from scratch so you actually understand what's happening.

Users can deposit ETH, borrow USDC against it, repay their debt, and withdraw safely. The protocol enforces LTV ratios, computes health factors on every action, and liquidates under-collateralised positions with bonus incentives for liquidators.

The backend indexes every on-chain event into Postgres in real time, so the frontend always reflects true protocol state — no polling, no stale data.

---

## Features

- **Collateral & Borrowing** — Deposit ETH, borrow USDC up to your LTV limit
- **Health Factor Engine** — Real-time risk score; drops below 1 and you're eligible for liquidation
- **Liquidation System** — On-chain liquidation with configurable bonus for liquidators
- **Oracle-Driven Pricing** — LTV and health factor computed against live price feeds
- **Event Indexer** — NestJS backend mirrors all on-chain state into Postgres idempotently
- **Liquidation Intelligence API** — Backend pre-computes seizable collateral, bonus, and eligibility
- **Wallet-Native UX** — RainbowKit + wagmi; real transactions with auto-refresh post-confirmation
- **Transaction History** — Full audit trail per wallet

---

## Tech Stack

### Monorepo
- **[Turborepo](https://turbo.build/)** — Monorepo build system

### Smart Contracts (`packages/contracts`)
- **Solidity 0.8.x** — Lending pool, liquidation engine, mock USDC
- **Foundry / Hardhat** — Testing and deployment

### Frontend (`apps/web`)
- **[Next.js](https://nextjs.org/)** — App Router
- **[RainbowKit](https://www.rainbowkit.com/)** — Wallet connection
- **[Wagmi](https://wagmi.sh/) + [Viem](https://viem.sh/)** — Ethereum hooks and utilities
- **[React Query](https://tanstack.com/query)** — Cache + invalidation after confirmations
- **[TailwindCSS](https://tailwindcss.com/)** — Styling

### Backend (`apps/api`)
- **[NestJS](https://nestjs.com/)** — Modular backend framework
- **[Prisma](https://www.prisma.io/)** — Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** — Protocol state mirror
- **[Viem](https://viem.sh/)** — On-chain event listening

### Infrastructure
- **[Vercel](https://vercel.com/)** — Frontend
- **AWS EC2** — Backend (nginx + PM2)
- **Sepolia** — Testnet deployment

---

## Architecture

```
LendX/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend + event indexer
├── packages/
│   └── contracts/    # ABIs, addresses (shared across apps)
└── turbo.json
```

```
Smart Contracts (Solidity)
        ↓  emits events
Event Indexer (NestJS + viem)
        ↓  mirrors state
Postgres via Prisma
        ↓  serves
REST API
        ↓  consumed by
Next.js Frontend (wagmi + RainbowKit)
```

The blockchain handles **trust and settlement**. The backend handles **protocol intelligence** — health factors, liquidation previews, analytics, and indexed history.

---

## Core Flows

**Deposit** — User deposits ETH → contract emits `Deposited` event → indexer updates DB → UI refreshes.

**Borrow** — Collateral checked against LTV → USDC minted to user → mirror state updated.

**Repay** — User approves USDC spend → repay tx → debt reduced in real time.

**Liquidation** — Health factor drops below 1 → liquidator calls contract → seizable collateral + bonus paid out → indexer reflects new state.

---

## API Endpoints

```
GET  /positions/:wallet          # Collateral, debt, health factor
GET  /transactions/:wallet       # Full transaction history
GET  /liquidation/preview/:wallet # Seizable amount, bonus, eligibility
GET  /stats/overview             # Protocol-wide TVL, borrows, utilisation
GET  /health                     # Indexer status
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL (local or hosted)

### Installation

```bash
git clone https://github.com/niladri-gudu/LendX.git
cd LendX
pnpm install
```

### Environment Setup

```bash
# apps/api
DATABASE_URL=
RPC_URL=
PRIVATE_KEY=

# apps/web
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_LENDING_POOL=
NEXT_PUBLIC_USDC_ADDRESS=
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
```

### Run Locally

```bash
pnpm --filter api dev
pnpm --filter web dev
```

---

## What I Learned

This was Project 2 of my 6 Projects in 60 Days challenge — the one where it stopped feeling like tutorial territory.

- Designing LTV ratios, health factors, and liquidation thresholds from first principles
- Why idempotent event indexing matters (reorgs, replays, duplicate events)
- How ERC20 approval UX creates friction — and how to smooth it
- Real-time cache invalidation after on-chain confirmations
- Protocol thinking: every state transition has a risk implication

---

## Roadmap

- [ ] **Automatic position recalculation on price change** — Oracle price updates trigger a BullMQ job that fans out across all open positions, recomputes health factors, and flags newly at-risk wallets in real time. Liquidation-eligible positions get queued for the liquidation bot automatically
- [ ] Dynamic interest rate curves (utilisation-based)
- [ ] Multi-asset collateral
- [ ] Subgraph integration
- [ ] Liquidation bot
- [ ] Risk dashboard

---

## Author

**Niladri** — [@dev_niladri](https://x.com/dev_niladri)

6 projects. 60 days. Web2 → Web3 in public. 4 more to go.

---

## License

MIT
