# Development Status

## Current State

Status: mock demo implemented and build verified.

Completed:

- Project renamed to `0G Orbit`.
- Next.js dashboard implemented.
- Mock wallet, policy envelope, operation runner, and receipt audit trail implemented.
- Four demo operations implemented:
  - approved contributor payout.
  - approved subscription renewal.
  - unknown recipient rejection.
  - over-cap payout rejection.
- Solidity contract skeletons added:
  - `OrbitFactory`.
  - `OrbitWallet`.
- Solidity contracts compile successfully with `solcjs`.
- Local Galileo test wallet generated.
- GitHub repository created.
- Initial commits pushed to GitHub.
- TypeScript check passed.
- Next.js production build passed.
- Contract compile passed.
- Galileo deployment completed.
- Orbit wallet created and funded on Galileo.
- One allowed operation executed on Galileo.
- Browser smoke test at `http://localhost:3000` passed with receipt execution.

## GitHub Repository

Remote: https://github.com/paradoxSCH/0g-orbit.git

Note: the current demo is pushed on the `master` branch.

## Test Wallet

Galileo test wallet address:

```text
0x9e6912987f71970D96AB7a16151962D9502833dA
```

The private key is stored in local `.env.local`, which is gitignored. This wallet should only be used for testnet/demo purposes.

## Galileo Deployment

Deployment record: [../deployments/galileo.json](../deployments/galileo.json)

- Faucet tx: `0x360bbd258e3e612fe423bf363abb94c96903c76a5932837c6bc11e7524214209`.
- OrbitFactory: `0xDa6B1c6b391E7Aa1EAF8124Ce36523B274dac422`.
- OrbitWallet: `0xE63503a61fafF1E0b57019849924818fA62Efa36`.
- Allowed execution tx: `0x09bfe02e652d734ea465e99ea0e98f65b7b9ffcac1264d6eb0872980b2199190`.
- Rejected sample reason: `RECIPIENT_NOT_ALLOWED`.

## Verified Commands

```bash
npm run typecheck
npm run build
npm run compile:contracts
npm run deploy:galileo -- --faucet-tx=0x360bbd258e3e612fe423bf363abb94c96903c76a5932837c6bc11e7524214209
```

All commands passed.

## Remaining Phases Before Submission Demo

### Phase 1: Contract Tests

- Keep `solcjs` compile path or add Foundry/Hardhat tests.
- Add tests for allowed and rejected operations.

### Phase 2: Explorer and Contract Evidence

- Add Galileo explorer links if an explorer URL is available.
- Consider verifying source code if the explorer supports verification.
- Add a short contract walkthrough to the demo script.

### Phase 3: 0G Storage Integration

- Replace mock receipt root with real 0G Storage upload.
- Upload at least one receipt bundle.
- Write the storage root/hash into receipt flow.
- Add proof links to README.

### Phase 4: 0G Compute / Agent Mock Upgrade

- Keep deterministic agent mock as fallback.
- Add 0G Compute operation reasoning if feasible.
- Store compute metadata in the receipt bundle.

### Phase 5: Submission Assets

- Record a demo video under 3 minutes.
- Prepare public X post with required hashtags and tags.
- Add screenshots and architecture diagram.
- Fill HackQuest submission fields.
