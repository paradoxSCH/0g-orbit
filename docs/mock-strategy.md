# Mock Strategy

The project should be built so every external dependency can be mocked first and replaced later without changing the demo narrative.

## Mock First

### Agent Reasoning

Initial mock:

```json
{
  "agentId": "agent-dao-ops-001",
  "task": "Pay approved contributor for design work",
  "recommendation": "execute",
  "reason": "Recipient is allowlisted, invoice is present, amount is below per-transaction and daily budget limits.",
  "riskLevel": "low"
}
```

Later replacement:

- Generate this through 0G Compute.
- Include model name, prompt hash, response hash, and provider metadata.

### 0G Storage

Initial mock:

- Store receipt JSON in local `/mock-storage` or browser state.
- Generate `storageRoot = keccak256(receiptJson)`.

Later replacement:

- Upload receipt JSON to 0G Storage.
- Use returned root/hash in `ReceiptRegistry`.

### Agent ID

Initial mock:

- Use a fixed authorized agent wallet address.
- Display a mock `agentId` in the UI.

Later replacement:

- Mint or reference Agent ID / INFT.
- Bind `agentId` or token owner to `OrbitWallet.authorizedAgent`.

### Risk Auditor

Initial mock:

- Deterministic TypeScript function:
  - reject unknown recipients.
  - reject over-cap operations.
  - reject disallowed selectors.
  - reject cooldown violations.

Later replacement:

- 0G Compute risk-auditor produces an attestation object.
- Wallet verifies attestation signer for high-risk calls.

## What Must Not Be Mocked by Final Submission

- Contract deployment on 0G Chain.
- At least one real on-chain wallet creation transaction.
- At least one real policy update transaction.
- At least one real allowed execution transaction.
- At least one real 0G Storage receipt or proof artifact.

## Demo Data

Use fixed entities for repeatable demos:

- DAO owner: deployer wallet.
- Authorized agent: ops agent wallet or Agent ID.
- Approved contributor: `Alice Designer`.
- Approved service: `Research API`.
- Blocked recipient: `Unknown Vendor`.
- Per-transaction cap: 50 A0GI.
- Daily budget: 150 A0GI.
- Wallet funding: 200 A0GI in demo funds.

## Receipt Bundle Shape

```json
{
  "receiptVersion": "0.1",
  "wallet": "0x...",
  "owner": "0x...",
  "agent": {
    "agentId": "agent-dao-ops-001",
    "address": "0x..."
  },
  "operation": {
    "kind": "transfer",
    "to": "0x...",
    "amount": "25",
    "token": "A0GI",
    "purpose": "Contributor payout"
  },
  "policySnapshot": {
    "perTxCap": "50",
    "dailyCap": "150",
    "recipientAllowed": true,
    "cooldownSatisfied": true
  },
  "agentReasoning": {
    "recommendation": "execute",
    "riskLevel": "low",
    "reasonHash": "0x..."
  },
  "result": {
    "status": "executed",
    "txHash": "0x..."
  }
}
```
