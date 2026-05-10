# Hackathon Deliverables

## Required Submission Materials

1. Project name
   - Working name: 0G Orbit.

2. One-sentence description
   - 0G Orbit is a self-custodial operational wallet that lets AI agents spend and execute only within user-defined policies, with verifiable receipts on 0G.

3. Short summary
   - Explain the problem: agents need operational authority but should not receive private keys or unlimited wallet permissions.
   - Explain the solution: policy-gated wallet with bounded spending, allowlists, cooldowns, and verifiable action receipts.
   - Explain 0G usage: Chain for enforcement, Storage for audit bundles, Compute for operation/risk reasoning, Agent ID for agent authorization.

4. GitHub repository
   - Public repo with meaningful commits.
   - Include architecture diagram, local run steps, contract addresses, demo accounts, and testing notes.

5. 0G integration proof
   - 0G mainnet or accepted testnet contract address.
   - 0G explorer link showing wallet creation, policy update, allowed execution, and rejected execution if possible.
   - Storage proof showing at least one receipt bundle uploaded.

6. Demo video under 3 minutes
   - Recommended structure:
     - 0:00-0:20 problem and setup.
     - 0:20-0:45 create/fund wallet and set policy.
     - 0:45-1:40 run allowed and rejected operations.
     - 1:40-2:20 show 0G Chain receipts and 0G Storage audit bundle.
     - 2:20-2:50 explain why this matters for agent economy.

7. README / documentation
   - Overview.
   - System architecture.
   - 0G modules used.
   - Deployment steps.
   - Contract addresses.
   - Test account instructions.
   - Demo script.

8. Public X post
   - Must include project name, screenshot or short clip, hashtags `#0GHackathon` and `#BuildOn0G`, and tags `@0G_labs @0g_CN @0g_Eco @HackQuest_`.

## Suggested Optional Materials

- One-page pitch deck.
- Architecture diagram.
- Threat model.
- Test report.
- Short technical article: "Why AI agents need bounded wallets, not private keys."

## Milestone Plan

### Day 1: Product Skeleton

- Finalize naming and one-liner.
- Scaffold repo.
- Write initial README.
- Implement static dashboard mock.
- Implement JSON mock receipts.

### Day 2: Contract MVP

- Implement factory, wallet, policy checks, and receipt events.
- Add unit tests for allowed and rejected operations.
- Connect frontend to local chain.

### Day 3: 0G Integration Pass

- Deploy contracts to 0G network.
- Upload receipt bundle to 0G Storage.
- Replace local receipt mock with storage-backed flow.
- Add explorer links to README.

### Day 4: Agent / Compute Pass

- Add mocked ops-agent first.
- Add 0G Compute call if feasible.
- Add signed or hashed operation plan.
- Store agent reasoning in receipt bundle.

### Day 5: Polish and Submission

- Record demo video.
- Write X post.
- Add screenshots.
- Verify all submission requirements.
- Freeze demo branch.
