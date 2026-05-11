import nextEnv from "@next/env";
import { Indexer, MemData } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const rpcUrl = process.env.ORBIT_GALILEO_RPC_URL || "https://evmrpc-testnet.0g.ai";
const indexerRpc = process.env.ORBIT_STORAGE_INDEXER_RPC || "https://indexer-storage-testnet-turbo.0g.ai";
const privateKey = process.env.ORBIT_DEPLOYER_PRIVATE_KEY;
const expectedReplica = Number(process.env.ORBIT_STORAGE_EXPECTED_REPLICA || "1");

if (!privateKey) {
  throw new Error("ORBIT_DEPLOYER_PRIVATE_KEY is required in .env.local");
}

const deployment = JSON.parse(readFileSync(join("deployments", "galileo.json"), "utf8"));
const receiptBundle = {
  schema: "0g-orbit.receipt-bundle.v1",
  project: "0G Orbit",
  persona: "DAO ops lead",
  operation: {
    title: "Pay approved operator through bounded Orbit wallet",
    status: "executed",
    valueA0GI: deployment.demoExecuteValueA0GI,
    recipient: deployment.deployer,
    receiptRoot: deployment.demoReceiptRoot,
    txHash: deployment.transactions.executeAllowedOperation
  },
  policySnapshot: {
    orbitWallet: deployment.orbitWalletAddress,
    authorizedAgent: deployment.agent,
    perTxCapA0GI: deployment.policy.perTxCapA0GI,
    dailyCapA0GI: deployment.policy.dailyCapA0GI,
    cooldownSeconds: deployment.policy.cooldownSeconds,
    allowedRecipients: [deployment.deployer],
    rejectedSampleReason: deployment.demoRejectedReason
  },
  agentReasoning: [
    "Invoice and recipient were matched against the owner-approved allowlist.",
    "Requested value was below the per-transaction and daily policy caps.",
    "The operation emitted a receipt root and can be replayed against the policy snapshot."
  ],
  chainEvidence: {
    network: deployment.network,
    chainId: deployment.chainId,
    factoryAddress: deployment.factoryAddress,
    orbitWalletAddress: deployment.orbitWalletAddress,
    transactions: deployment.transactions
  },
  generatedAt: new Date().toISOString()
};

mkdirSync(join("data", "receipt-bundles"), { recursive: true });
mkdirSync("integrations", { recursive: true });

const bundlePath = join("data", "receipt-bundles", "galileo-operation.json");
const bundleBytes = new TextEncoder().encode(JSON.stringify(receiptBundle, null, 2));
writeFileSync(bundlePath, `${JSON.stringify(receiptBundle, null, 2)}\n`);

const file = new MemData(bundleBytes);
const [tree, treeError] = await file.merkleTree();

if (treeError) {
  throw treeError;
}

const localRootHash = tree.rootHash();
const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);
const indexer = new Indexer(indexerRpc);
let storageStatus;

try {
  const [uploadResult, uploadError] = await indexer.upload(
    file,
    rpcUrl,
    signer,
    {
      expectedReplica,
      finalityRequired: false,
      skipIfFinalized: true,
      onProgress: (message) => console.log(`storage: ${message}`)
    }
  );

  if (uploadError) {
    throw uploadError;
  }

  storageStatus = {
    mode: "0g-storage",
    status: "uploaded",
    indexerRpc,
    expectedReplica,
    localRootHash,
    uploadResult,
    bundlePath,
    uploadedAt: new Date().toISOString()
  };
} catch (error) {
  storageStatus = {
    mode: "mock-fallback",
    status: "prepared",
    indexerRpc,
    expectedReplica,
    localRootHash,
    uploadError: error instanceof Error ? error.message : String(error),
    bundlePath,
    preparedAt: new Date().toISOString()
  };
}

writeFileSync(join("integrations", "storage-status.json"), `${JSON.stringify(storageStatus, null, 2)}\n`);

console.log(`Receipt bundle: ${bundlePath}`);
console.log(`Local root hash: ${localRootHash}`);
console.log(`Storage status: ${storageStatus.status} (${storageStatus.mode})`);
if (storageStatus.uploadResult) {
  console.log(`Storage tx/root: ${JSON.stringify(storageStatus.uploadResult)}`);
}
if (storageStatus.uploadError) {
  console.log(`Storage fallback reason: ${storageStatus.uploadError}`);
}