export type OperationStatus = "allowed" | "rejected";
export type ReceiptStatus = "executed" | "rejected" | "simulated";
export type RiskLevel = "low" | "medium" | "high";

export type DemoOperation = {
  id: string;
  title: string;
  recipient: string;
  amount: number;
  expectedStatus: OperationStatus;
  riskLevel: RiskLevel;
  reason: string;
  agentReasoning: string;
};

export type DemoReceipt = {
  id: string;
  title: string;
  status: ReceiptStatus;
  amount: number;
  recipient: string;
  reason: string;
  receiptRoot: string;
  policyHash: string;
  timestamp: string;
};

export const walletProfile = {
  name: "DAO Ops Orbit",
  balance: 200,
  owner: "0xA17e00000000000000000000000000000000DA0",
  agentName: "Ops Agent #042",
  agentAddress: "0x0A6e0000000000000000000000000000000A6e42"
};

export const policySnapshot = {
  perTxCap: 50,
  dailyCap: 150,
  cooldownMinutes: 10,
  allowedRecipients: ["Alice Designer", "Research API"],
  allowedSelectors: ["transfer(address,uint256)", "renewSubscription(uint256)"],
  policyHash: "0x706f6c6963792d686173682d30672d6f726269742d64656d6f0000000000"
};

export const demoOperations: DemoOperation[] = [
  {
    id: "pay-alice",
    title: "Pay Alice Designer",
    recipient: "Alice Designer",
    amount: 25,
    expectedStatus: "allowed",
    riskLevel: "low",
    reason: "Recipient is allowlisted and amount is under the per-transaction cap.",
    agentReasoning:
      "Invoice INV-042 matches an approved contributor. The requested payout is below policy limits and does not violate cooldown or daily budget constraints."
  },
  {
    id: "renew-api",
    title: "Renew Research API",
    recipient: "Research API",
    amount: 10,
    expectedStatus: "allowed",
    riskLevel: "low",
    reason: "Service contract and renewal selector are allowlisted.",
    agentReasoning:
      "The research subscription expires today. Renewal uses an approved contract selector and keeps the DAO's weekly research workflow online."
  },
  {
    id: "unknown-vendor",
    title: "Pay Unknown Vendor",
    recipient: "Unknown Vendor",
    amount: 20,
    expectedStatus: "rejected",
    riskLevel: "medium",
    reason: "Recipient is not in the owner-approved allowlist.",
    agentReasoning:
      "The vendor requested a payout, but the address has no prior approval record. The agent recommends blocking execution until the owner reviews it."
  },
  {
    id: "over-cap",
    title: "Large Contributor Payout",
    recipient: "Alice Designer",
    amount: 75,
    expectedStatus: "rejected",
    riskLevel: "high",
    reason: "Amount exceeds the 50 A0GI per-transaction cap.",
    agentReasoning:
      "The recipient is approved, but the requested amount is larger than the active policy envelope. The agent should split or request owner approval."
  }
];

export const initialReceipts: DemoReceipt[] = [
  {
    id: "seed-1",
    title: "Policy Snapshot Anchored",
    status: "simulated",
    amount: 0,
    recipient: "0G Storage",
    reason: "Initial policy bundle prepared for 0G Storage upload.",
    receiptRoot: "0x736565642d706f6c6963792d726563656970742d30672d6f726269740000",
    policyHash: policySnapshot.policyHash,
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  }
];

export function formatAddress(value: string, visible = 6) {
  if (value.length <= visible * 2 + 2) {
    return value;
  }

  return `${value.slice(0, visible)}...${value.slice(-visible)}`;
}
