# MVP Spec

## MVP Goal

Build a working demo that proves an authorized AI agent can operate a wallet only within explicit user-defined boundaries, and that every accepted or rejected operation is auditable through 0G Chain and 0G Storage.

## In Scope

### Smart Contracts

1. `OrbitFactory`
   - Deploys user-owned Orbit wallets.
   - Emits wallet creation events.

2. `OrbitWallet`
   - Holds native token or test ERC20 funds.
   - Stores owner and authorized agent identity.
   - Executes policy-checked transfers or calls.
   - Supports emergency pause.

3. `PolicyManager`
   - Stores policy config per wallet.
   - Enforces per-transaction cap.
   - Enforces daily or rolling-window spend cap.
   - Enforces recipient allowlist.
   - Enforces function selector allowlist for contract calls.
   - Enforces cooldown between operations.

4. `ReceiptRegistry`
   - Records action hash, result status, storage root, wallet, agent, and timestamp.
   - Emits events for frontend indexing.

### Backend / Agent Mock

1. `ops-agent`
   - Produces operation proposals from canned tasks.
   - Can run fully mocked first.
   - Later calls 0G Compute for generated reasoning.

2. `risk-auditor`
   - Initially deterministic rules.
   - Stretch: 0G Compute-backed signed attestation.

3. `receipt-writer`
   - Creates JSON audit bundle.
   - Uploads to 0G Storage or local mock storage first.
   - Returns root/hash for on-chain receipt.

### Frontend

1. Owner dashboard
   - Create wallet.
   - Fund wallet.
   - Set policy.
   - Authorize agent.
   - Pause/resume wallet.

2. Agent run panel
   - Select one of four demo operations.
   - Show agent reasoning.
   - Execute operation.
   - Display accepted/rejected result.

3. Audit panel
   - Show receipt list.
   - Link to 0G explorer transaction.
   - Link or display 0G Storage audit bundle.

## Out of Scope for MVP

- Full marketplace of agents or services.
- Real production custody UX.
- Complex account abstraction stack unless already easy to integrate.
- Cross-chain execution.
- Real proprietary TEE policy execution.
- Sophisticated DeFi strategy execution.

## Demo Operations

| Operation | Expected Result | Why |
| --- | --- | --- |
| Pay approved contributor 25 A0GI | Allowed | Recipient is allowlisted and amount is under cap |
| Renew approved API service 10 A0GI | Allowed | Service address and selector are allowlisted |
| Transfer 20 A0GI to unknown recipient | Rejected | Recipient not allowlisted |
| Pay approved contributor 75 A0GI | Rejected | Exceeds per-transaction cap |
| Optional high-risk contract call | Rejected until attested | Requires risk attestation |

## Success Criteria

- A judge can run the demo without reading the code.
- At least one allowed and two rejected operations are shown live.
- Each operation has a visible receipt.
- The README explains exactly where 0G Chain, Storage, Compute, and Agent ID are used.
- The demo video can fit the full story in under three minutes.
