const deployment = {
  network: "0G Galileo Testnet",
  chainId: "16602",
  explorerUrl: "https://chainscan-galileo.0g.ai",
  faucetTxHash: "0x360bbd258e3e612fe423bf363abb94c96903c76a5932837c6bc11e7524214209",
  deployer: "0x9e6912987f71970D96AB7a16151962D9502833dA",
  agent: "0x9e6912987f71970D96AB7a16151962D9502833dA",
  factoryAddress: "0xDa6B1c6b391E7Aa1EAF8124Ce36523B274dac422",
  orbitWalletAddress: "0xE63503a61fafF1E0b57019849924818fA62Efa36",
  demoExecuteValueA0GI: "0.001",
  demoReceiptRoot: "0x6501319d6ab8fdc2c25e7ef73bd6450e8b94ab2c9d59ecc4482f494cc0c3c89a",
  demoRejectedReason: "RECIPIENT_NOT_ALLOWED",
  deployedAt: "2026-05-11T05:16:05.789Z",
  transactions: {
    executeAllowedOperation: "0x09bfe02e652d734ea465e99ea0e98f65b7b9ffcac1264d6eb0872980b2199190"
  }
};

const storageStatus = {
  status: "uploaded",
  mode: "0g-storage",
  localRootHash: "0xa421435a8ea2bc5255fada6fba4e4a8b0d66f7a76bb5aa810432e51ad15151a1",
  uploadResult: {
    txHash: "0xaf82f6add8fb89c82036399781485319e572fda7a7a201edf9a27ca7ed3ceac8",
    rootHash: "0xa421435a8ea2bc5255fada6fba4e4a8b0d66f7a76bb5aa810432e51ad15151a1",
    txSeq: 104885
  },
  bundlePath: "data/receipt-bundles/galileo-operation.json"
};

const computeAttestation = {
  computeDiscovery: {
    status: "providers-discovered",
    mode: "0g-compute-readonly",
    providerCount: 6,
    providers: [{ model: "qwen/qwen-2.5-7b-instruct" }]
  },
  result: {
    verdict: "approve",
    riskScore: 8
  },
  attestationRoot: "0xf0d39b1f4c4c9ac78f8f4f90def666096ec0fcfd777b61e2153cd788e8d0c237"
};

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
