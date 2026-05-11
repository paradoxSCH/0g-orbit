# 0G Orbit

0G Orbit is a self-custodial operational wallet for AI agents. It lets users and DAOs delegate bounded authority to autonomous agents without handing over private keys or unlimited spending power.

The project targets Track 3: Agentic Economy & Autonomous Applications, with a narrow focus on operational tools: self-custodial agent wallets, policy-gated execution, verifiable receipts, and optional risk attestations for high-risk actions.

## One-Liner

0G Orbit gives AI agents a bounded wallet: agents can spend, subscribe, call tools, and execute approved operations only within user-defined policies, with every action recorded as a verifiable 0G receipt.

## Core Thesis

Autonomous agents should not hold private keys. They should hold limited, revocable, auditable authority.

## MVP Demo Flow

1. A DAO owner creates a 0G Orbit wallet.
2. The owner funds the wallet and authorizes an Agent ID.
3. The owner defines policies: daily budget, per-transaction cap, allowed recipients, allowed function selectors, cooldowns, and risk rules.
4. An AI ops agent proposes actions such as paying a contractor, renewing a service, or calling an approved contract.
5. 0G Compute produces or validates the operation plan.
6. The wallet contract executes safe operations and rejects violations.
7. Each action emits an on-chain receipt hash and stores the full reasoning, invoice, policy snapshot, and result on 0G Storage.

## Planned 0G Integration

- 0G Chain: Orbit wallet, policy registry, authorized Agent ID binding, receipt registry.
- 0G Storage: invoices, agent reasoning, execution receipts, policy snapshots, audit bundles.
- 0G Compute: mocked first, then used for operation proposal and risk evaluation.
- Agent ID: authorized agent identity controlling bounded execution.
- Privacy / Secure Execution: optional stretch goal for private task inputs, private budgets, and sensitive policy checks.

## Galileo Deployment

- Network: 0G Galileo Testnet, chain ID `16602`.
- OrbitFactory: `0xDa6B1c6b391E7Aa1EAF8124Ce36523B274dac422`.
- OrbitWallet: `0xE63503a61fafF1E0b57019849924818fA62Efa36`.
- Allowed execution tx: `0x09bfe02e652d734ea465e99ea0e98f65b7b9ffcac1264d6eb0872980b2199190`.
- Deployment record: [deployments/galileo.json](deployments/galileo.json).

## Key Docs

- [Product Plan](docs/product-plan.md)
- [MVP Spec](docs/mvp-spec.md)
- [Deliverables](docs/deliverables.md)
- [Mock Strategy](docs/mock-strategy.md)
- [User Prep Checklist](docs/user-prep-checklist.md)
- [Competition Positioning](docs/competition-positioning.md)
- [Execution Backlog](docs/execution-backlog.md)
- [Architecture](docs/architecture.md)
- [Naming](docs/naming.md)
- [Development Status](docs/dev-status.md)

## Development Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run compile:contracts
npm run deploy:galileo -- --faucet-tx=<FAUCET_TX_HASH>
```

Create a local Galileo test wallet:

```bash
npm run wallet:create
```
