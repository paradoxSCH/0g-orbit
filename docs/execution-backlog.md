# Execution Backlog

## Build Order

### Phase 0: Confirm Direction

Status: ready for user confirmation.

- Confirm final name: 0G Orbit or a rename.
- Confirm primary persona: DAO ops lead is recommended.
- Confirm target deployment network.
- Confirm frontend and contract stack.

### Phase 1: Mockable Product Shell

Status: can start immediately.

- Scaffold app.
- Build dashboard shell:
  - wallet overview.
  - policy editor.
  - operation runner.
  - receipt/audit panel.
- Add static demo data for four operations.
- Add local mock receipt generation.
- Add local mock storage root hashing.

Exit criteria:

- A non-chain demo can show the product story end to end.
- Allowed and rejected operations are visually clear.

### Phase 2: Smart Contract MVP

Status: can start after stack confirmation.

- Implement `OrbitFactory`.
- Implement `OrbitWallet`.
- Implement `PolicyManager` or embed policy in wallet for MVP simplicity.
- Implement `ReceiptRegistry` or emit events directly from wallet for MVP simplicity.
- Add tests for:
  - owner creates wallet.
  - owner sets policy.
  - authorized agent executes allowed transfer.
  - unknown recipient is rejected.
  - over-cap payment is rejected.
  - paused wallet rejects execution.

Exit criteria:

- Local tests pass.
- Frontend can call contracts locally.

### Phase 3: 0G Chain + Storage

Status: depends on deployer wallet and funds.

- Deploy contracts to selected 0G network.
- Save addresses in README.
- Generate real execution transactions.
- Upload at least one receipt bundle to 0G Storage.
- Write storage root/hash to on-chain receipt.
- Add explorer links.

Exit criteria:

- README has contract addresses and transaction links.
- Demo can prove actual 0G usage.

### Phase 4: Agent / Compute Integration

Status: mock first; real integration if time allows.

- Replace static agent reasoning with API-generated reasoning.
- Add 0G Compute call for operation proposal or risk evaluation.
- Store compute metadata in receipt bundle.
- Add fallback path so demo still works if compute call fails.

Exit criteria:

- At least one receipt includes compute-backed reasoning or a documented compute stub plus integration notes.

### Phase 5: Submission Polish

Status: final phase.

- Record under-3-minute demo video.
- Add architecture diagram.
- Add local reproduction steps.
- Add threat model summary.
- Write X post.
- Verify every HackQuest field.

## Recommended MVP Simplifications

- Use native token transfers first, ERC20 later if needed.
- Store policy directly in `OrbitWallet` first, split into `PolicyManager` only if code stays clean.
- Use events as receipt index first, separate `ReceiptRegistry` only if needed.
- Use deterministic TypeScript agent mock first, 0G Compute second.
- Avoid account abstraction unless it is already easy in the 0G environment.

## Immediate Questions for User

Please answer these before implementation starts:

1. Final name: keep `0G Orbit`, or pick another name?
2. Primary demo persona: DAO ops lead, startup founder, AI SaaS operator, or another?
3. Preferred stack: Next.js + Foundry, Next.js + Hardhat, or no preference?
4. Deployment target: 0G mainnet, Galileo testnet, or decide after docs check?
5. Do you already have 0G wallet funds and an X/GitHub account ready for submission?
