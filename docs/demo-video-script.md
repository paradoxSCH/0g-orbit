# Demo Video Script

## Reference Style

Do not copy a specific winning video. Use the common winning-demo pattern:

- First 10 seconds: state the problem in one sentence.
- Next 20 seconds: show the product already working, not slides.
- Middle: prove the hard part with live UI, chain evidence, and stored data.
- Last 20 seconds: explain why this is differentiated and what 0G modules are used.

The best target is a crisp 2:30-2:50 screen recording with voiceover. Avoid a long pitch deck opening.

## Core Message

0G Orbit lets a DAO delegate bounded operational authority to an AI agent without giving the agent private keys or unlimited wallet access. The demo proves four things:

1. The agent can execute only inside owner-defined policy bounds.
2. The wallet exists on 0G Galileo.
3. The execution receipt is stored on 0G Storage.
4. 0G Compute SDK is used for provider discovery and a risk-attestation flow.

## Recording Setup

Open these before recording:

- Local demo: `http://localhost:3000`.
- Explorer address: `https://chainscan-galileo.0g.ai/address/0xE63503a61fafF1E0b57019849924818fA62Efa36`.
- Explorer tx: `https://chainscan-galileo.0g.ai/tx/0x09bfe02e652d734ea465e99ea0e98f65b7b9ffcac1264d6eb0872980b2199190`.
- GitHub repo: `https://github.com/paradoxSCH/0g-orbit`.
- Optional local files in VS Code:
  - `integrations/storage-status.json`
  - `integrations/compute-attestation.json`
  - `data/receipt-bundles/galileo-operation.json`

Use browser zoom around 90-100%. Keep terminal/private env files closed.

## Shot-By-Shot Script

### 0:00-0:12 - Hook

Visual: 0G Orbit dashboard top section.

Voiceover:

"AI agents are starting to operate wallets, but giving an agent a private key is too much authority. 0G Orbit gives agents bounded, revocable, auditable wallet permissions instead."

### 0:12-0:28 - Persona And Problem

Visual: Show `DAO Ops Orbit`, wallet balance, authorized agent, owner address.

Voiceover:

"The demo persona is a DAO ops lead. They want an AI agent to handle routine operations, like contributor payouts or subscription renewals, while keeping spending caps, allowlists, cooldowns, and audit trails under owner control."

### 0:28-0:48 - Policy Envelope

Visual: Hover or point through Active Bounds: per-transaction cap, daily budget, recipients, selectors, cooldown.

Voiceover:

"The owner sets the policy envelope. This deployed wallet allows small operations, blocks unknown recipients, blocks oversized payouts, and can be paused by the owner."

### 0:48-1:15 - Allowed Operation

Visual: Select `Pay Alice Designer`, click `Run Operation`, show new executed receipt.

Voiceover:

"Here the agent proposes an approved contributor payout. The recipient is allowlisted, the amount is below the cap, and the wallet marks the operation executable. Running it creates a receipt with the policy result and root hash."

### 1:15-1:35 - Rejected Operation

Visual: Select `Pay Unknown Vendor` or `Large Contributor Payout`; show `Blocked` verdict. Optionally click run to add rejected receipt.

Voiceover:

"If the agent tries an unknown vendor or a payout above the transaction cap, Orbit blocks it. The agent is useful, but it cannot escape the user's policy."

### 1:35-1:58 - Live 0G Chain Proof

Visual: Scroll to `Live Deployment`. Click Orbit Wallet or Allowed Tx explorer link.

Voiceover:

"This is not only a UI mock. The OrbitFactory and OrbitWallet are deployed on 0G Galileo. The allowed operation transaction is visible on the Galileo explorer, so judges can verify the execution on-chain."

Key values to show:

- OrbitFactory: `0xDa6B1c6b391E7Aa1EAF8124Ce36523B274dac422`
- OrbitWallet: `0xE63503a61fafF1E0b57019849924818fA62Efa36`
- Allowed tx: `0x09bfe02e652d734ea465e99ea0e98f65b7b9ffcac1264d6eb0872980b2199190`

### 1:58-2:18 - 0G Storage Proof

Visual: Return to dashboard, show `Receipt Evidence`; optionally switch to `integrations/storage-status.json`.

Voiceover:

"The receipt bundle is uploaded to 0G Storage. It contains the operation, policy snapshot, agent reasoning, and chain evidence, so the audit trail can be replayed later."

Key values to show:

- Storage root: `0xa421435a8ea2bc5255fada6fba4e4a8b0d66f7a76bb5aa810432e51ad15151a1`
- Storage tx: `0xaf82f6add8fb89c82036399781485319e572fda7a7a201edf9a27ca7ed3ceac8`

### 2:18-2:36 - 0G Compute Evidence

Visual: Show Compute Providers and Risk Verdict in the dashboard; optionally show `integrations/compute-attestation.json`.

Voiceover:

"For the compute layer, the demo uses the 0G Compute SDK to discover available providers and produces a risk attestation over the policy, receipt root, and operation. The current version keeps deterministic reasoning as a fallback for demo reliability."

Key values to show:

- Provider discovery: `6 discovered`
- Verdict: `approve / score 8`
- Attestation root: `0xf0d39b1f4c4c9ac78f8f4f90def666096ec0fcfd777b61e2153cd788e8d0c237`

### 2:36-2:52 - Differentiation

Visual: Show integration map or README one-liner.

Voiceover:

"0G Orbit is not an agent marketplace or trading bot. It is the missing permission layer for autonomous operations: agents can act, but only inside bounded wallet rules, with receipts on 0G Chain, Storage, and Compute."

### 2:52-3:00 - Close

Visual: GitHub repo or dashboard final screen.

Voiceover:

"The code, deployment record, storage proof, and compute attestation are public in the GitHub repo. This is the foundation for safer agentic operations on 0G."

## YouTube Preparation

Upload the demo as unlisted or public. Prepare:

- Title: `0G Orbit - Bounded Wallets for AI Agents on 0G`
- Description:
  `0G Orbit is a self-custodial operational wallet that lets AI agents execute only within owner-defined policies, with verifiable receipts on 0G Chain, 0G Storage, and 0G Compute.`
- Include links:
  - GitHub: `https://github.com/paradoxSCH/0g-orbit`
  - Demo repo deployment record path: `deployments/galileo.json`
  - Galileo explorer: `https://chainscan-galileo.0g.ai`
- Tags: `0G`, `0G Hackathon`, `AI agents`, `agentic economy`, `wallet security`, `DAO ops`.
- Visibility: unlisted is usually acceptable unless HackQuest requires public. Public is safer for discoverability.

## X Post Preparation

Required tags and hashtags from the deliverables doc:

- `#0GHackathon`
- `#BuildOn0G`
- `@0G_labs`
- `@0g_CN`
- `@0g_Eco`
- `@HackQuest_`

Suggested post:

```text
Introducing 0G Orbit: bounded operational wallets for AI agents.

Agents can help a DAO pay contributors or renew services, but they should not hold private keys or unlimited permissions. 0G Orbit enforces owner-defined spending caps, allowlists, cooldowns, and audit receipts.

Built on 0G Galileo:
- OrbitWallet deployed on-chain
- receipt bundle uploaded to 0G Storage
- 0G Compute SDK provider discovery + risk attestation

GitHub: https://github.com/paradoxSCH/0g-orbit
Demo: <YOUTUBE_LINK>

#0GHackathon #BuildOn0G @0G_labs @0g_CN @0g_Eco @HackQuest_
```

Attach one of these:

- 30-60 second clip cut from the demo video.
- Screenshot of the dashboard showing Live Deployment and Receipt Evidence.
- Architecture diagram if the screenshot is too dense.

## Contract Verification Impact

Contract source verification means uploading Solidity source and compiler settings to the explorer so users can read source code directly on the explorer address page.

Impact on submission:

- Helpful for trust and polish.
- Not usually a blocker if the README has source files, addresses, deployment txs, and compile command.
- Worth doing if `chainscan-galileo.0g.ai` exposes a verify flow or API.
- If unsupported, state in README that contracts are open-source in GitHub and compiled with `solcjs`.

Priority: medium. Do it after the video script and before final submission only if it is quick.

## Paid Compute Inference Impact

The current demo already uses the 0G Compute SDK for provider discovery and creates a risk attestation tied to the storage root and wallet policy. Paid inference means depositing funds into the 0G Compute ledger, choosing a provider, getting request headers, and making an actual model call.

Impact on submission:

- Helpful because it proves active inference, not only discovery.
- Not strictly required if the demo clearly shows 0G Chain + 0G Storage + Compute SDK provider discovery.
- Adds operational risk: provider availability, balance requirements, request failures, and demo instability.
- Best approach: keep deterministic attestation as fallback, then add paid inference only if it can be made repeatable.

Priority: medium-high if time remains, but not worth breaking the stable demo. The current state is acceptable for submission; paid inference would improve the Compute story.

## Final Recording Checklist

- Do not show `.env.local` or private key.
- Start with dashboard, not terminal.
- Keep video under 3 minutes.
- Show at least one explorer page.
- Show Storage root and Compute attestation in the UI.
- End on repo link or final dashboard screen.
