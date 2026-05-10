# Product Plan: 0G Orbit

## Positioning

0G Orbit is a self-custodial wallet and policy engine for autonomous AI operations. It is not an agent marketplace and not a trading bot. It is the permission layer that lets an agent act on behalf of a user, DAO, or small team without receiving unlimited wallet control.

## Why This Is Less Crowded

Current 0G APAC gallery projects cluster around AI trading agents, agent marketplaces, proof-of-content, data markets, and general agent operating systems. 0G Orbit deliberately sits between those categories:

- It is not a marketplace because the first screen is a wallet/policy dashboard, not service discovery.
- It is not another DeFi strategy agent because it does not promise yield or alpha.
- It is not a generic firewall because the product is built around daily agent operations: spending, subscriptions, contractor payouts, tool calls, and budgeted execution.

## Target User

Primary user: a DAO, hackathon team, founder, or operator who wants to let an AI agent perform repetitive operational tasks while keeping custody and control.

Example: a DAO ops lead gives an agent a weekly budget for contributor payouts, data API subscriptions, research tasks, and approved contract calls. The agent can act quickly, but cannot exceed limits or send funds to unknown recipients.

## Core Problem

Agents are becoming capable enough to execute transactions, but current wallet patterns are binary:

- Full custody: too dangerous.
- Manual approval for every action: not autonomous.
- Backend API keys: opaque and centralized.

0G Orbit introduces a third pattern: bounded, policy-governed autonomy.

## Product Principles

- User keeps custody.
- Agent receives revocable authority, not keys.
- Policies are enforced on-chain where possible.
- Sensitive context and complete receipts live off-chain on 0G Storage.
- 0G Compute can propose actions, but the wallet decides what is executable.
- Demo must show both successful execution and rejected unsafe actions.

## Recommended Demo Narrative

Use a DAO operations scenario because it is easy to understand and avoids the crowded trading-agent lane.

Demo story:

1. A DAO creates a 0G Orbit wallet for its operations agent.
2. The DAO sets a 500 A0GI weekly budget, 50 A0GI per transaction limit, and a recipient allowlist.
3. The agent tries four operations:
   - Pay approved contributor: allowed.
   - Renew approved data service: allowed.
   - Transfer to unknown address: rejected.
   - Pay approved recipient but exceed per-transaction cap: rejected.
4. The dashboard shows on-chain receipts and 0G Storage audit bundles.

## Stretch Narrative

For higher technical depth, add a risk-attestation module:

- Low-risk operations use policy checks only.
- High-risk contract calls require a signed Risk Attestation from a 0G Compute auditor.
- The wallet rejects high-risk actions without an attestation.
