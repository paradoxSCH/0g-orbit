import deployment from "../../deployments/galileo.json";
import computeAttestation from "../../integrations/compute-attestation.json";
import storageStatus from "../../integrations/storage-status.json";

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
  balance: 0.019,
  owner: deployment.deployer,
  agentName: "Ops Agent #042",
  agentAddress: deployment.agent
};

export const policySnapshot = {
  perTxCap: 0.05,
  dailyCap: 0.15,
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
    amount: 0.025,
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
    amount: 0.01,
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
    amount: 0.02,
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
    amount: 0.075,
    expectedStatus: "rejected",
    riskLevel: "high",
    reason: "Amount exceeds the 50 A0GI per-transaction cap.",
    agentReasoning:
      "The recipient is approved, but the requested amount is larger than the active policy envelope. The agent should split or request owner approval."
  }
];

export const initialReceipts: DemoReceipt[] = [
  {
    id: "galileo-1",
    title: "Galileo Operation Executed",
    status: "executed",
    amount: Number(deployment.demoExecuteValueA0GI),
    recipient: "Deployer Wallet",
    reason: "Allowed recipient and transfer value stayed inside the deployed Orbit policy.",
    receiptRoot: deployment.demoReceiptRoot,
    policyHash: policySnapshot.policyHash,
    timestamp: deployment.deployedAt
  },
  {
    id: "seed-1",
    title: "Policy Snapshot Anchored",
    status: "simulated",
    amount: 0,
    recipient: "0G Storage",
    reason: "Initial policy bundle prepared for 0G Storage upload.",
    receiptRoot: "0x736565642d706f6c6963792d726563656970742d30672d6f726269740000",
    policyHash: policySnapshot.policyHash,
    timestamp: "2026-05-10T15:29:00.000Z"
  }
];

export const chainDeployment = {
  network: deployment.network,
  chainId: deployment.chainId,
  explorerUrl: deployment.explorerUrl,
  factoryAddress: deployment.factoryAddress,
  orbitWalletAddress: deployment.orbitWalletAddress,
  executeTxHash: deployment.transactions.executeAllowedOperation,
  rejectedReason: deployment.demoRejectedReason,
  faucetTxHash: deployment.faucetTxHash,
  links: {
    factory: `${deployment.explorerUrl}/address/${deployment.factoryAddress}`,
    orbitWallet: `${deployment.explorerUrl}/address/${deployment.orbitWalletAddress}`,
    executeTx: `${deployment.explorerUrl}/tx/${deployment.transactions.executeAllowedOperation}`,
    faucetTx: `${deployment.explorerUrl}/tx/${deployment.faucetTxHash}`,
    storageTx: `${deployment.explorerUrl}/tx/${storageStatus.uploadResult?.txHash ?? ""}`
  }
};

export const storageEvidence = {
  status: storageStatus.status,
  mode: storageStatus.mode,
  rootHash: storageStatus.uploadResult?.rootHash ?? storageStatus.localRootHash,
  txHash: storageStatus.uploadResult?.txHash,
  txSeq: storageStatus.uploadResult?.txSeq,
  bundlePath: storageStatus.bundlePath
};

export const computeEvidence = {
  status: computeAttestation.computeDiscovery.status,
  mode: computeAttestation.computeDiscovery.mode,
  providerCount: computeAttestation.computeDiscovery.providerCount ?? 0,
  verdict: computeAttestation.result.verdict,
  riskScore: computeAttestation.result.riskScore,
  attestationRoot: computeAttestation.attestationRoot,
  model: computeAttestation.computeDiscovery.providers?.[0]?.model ?? "mock fallback"
};

export function formatReceiptTime(timestamp: string) {
  const date = new Date(timestamp);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} UTC`;
}

export function formatAddress(value: string, visible = 6) {
  if (value.length <= visible * 2 + 2) {
    return value;
  }

  return `${value.slice(0, visible)}...${value.slice(-visible)}`;
}
