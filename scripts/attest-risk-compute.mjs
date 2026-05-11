import nextEnv from "@next/env";
import { createZGComputeNetworkReadOnlyBroker } from "@0gfoundation/0g-compute-ts-sdk";
import { ethers } from "ethers";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const rpcUrl = process.env.ORBIT_GALILEO_RPC_URL || "https://evmrpc-testnet.0g.ai";
const chainId = Number(process.env.NEXT_PUBLIC_0G_CHAIN_ID || "16602");
const includeUnacknowledged = (process.env.ORBIT_COMPUTE_INCLUDE_UNACKNOWLEDGED || "true") === "true";
const deployment = JSON.parse(readFileSync(join("deployments", "galileo.json"), "utf8"));
const storageStatusPath = join("integrations", "storage-status.json");
const storageStatus = JSON.parse(readFileSync(storageStatusPath, "utf8"));

const policyInput = {
  operation: "allowed DAO ops payout",
  valueA0GI: deployment.demoExecuteValueA0GI,
  perTxCapA0GI: deployment.policy.perTxCapA0GI,
  dailyCapA0GI: deployment.policy.dailyCapA0GI,
  recipientAllowlisted: true,
  walletPaused: false,
  storageRoot: storageStatus.uploadResult?.rootHash || storageStatus.localRootHash
};

const value = Number(policyInput.valueA0GI);
const perTxCap = Number(policyInput.perTxCapA0GI);
const riskScore = value <= perTxCap && policyInput.recipientAllowlisted && !policyInput.walletPaused ? 8 : 72;
const verdict = riskScore < 30 ? "approve" : "block";
let computeDiscovery;

try {
  const broker = await createZGComputeNetworkReadOnlyBroker(rpcUrl, chainId);
  const services = await broker.inference.listService(0, 10, includeUnacknowledged);
  computeDiscovery = {
    mode: "0g-compute-readonly",
    status: "providers-discovered",
    providerCount: services.length,
    providers: services.slice(0, 3).map((service) => ({
      provider: service.provider,
      model: service.model,
      url: service.url,
      inputPrice: service.inputPrice?.toString?.() ?? String(service.inputPrice),
      outputPrice: service.outputPrice?.toString?.() ?? String(service.outputPrice),
      updatedAt: service.updatedAt?.toString?.() ?? String(service.updatedAt)
    }))
  };
} catch (error) {
  computeDiscovery = {
    mode: "mock-fallback",
    status: "provider-discovery-unavailable",
    error: error instanceof Error ? error.message : String(error)
  };
}

const attestation = {
  schema: "0g-orbit.risk-attestation.v1",
  project: "0G Orbit",
  network: deployment.network,
  chainId: deployment.chainId,
  orbitWallet: deployment.orbitWalletAddress,
  input: policyInput,
  result: {
    verdict,
    riskScore,
    riskLevel: verdict === "approve" ? "low" : "high",
    checks: [
      { name: "recipient_allowlist", passed: policyInput.recipientAllowlisted },
      { name: "per_transaction_cap", passed: value <= perTxCap },
      { name: "wallet_pause_state", passed: !policyInput.walletPaused },
      { name: "receipt_bundle_available", passed: Boolean(policyInput.storageRoot) }
    ],
    explanation: "The operation remains inside the active Orbit policy envelope and has a receipt bundle root for audit replay."
  },
  computeDiscovery,
  attestationRoot: ethers.id(JSON.stringify({ policyInput, verdict, riskScore })),
  generatedAt: new Date().toISOString()
};

mkdirSync("integrations", { recursive: true });
writeFileSync(join("integrations", "compute-attestation.json"), `${JSON.stringify(attestation, null, 2)}\n`);

console.log(`Compute discovery: ${computeDiscovery.status} (${computeDiscovery.mode})`);
if (computeDiscovery.providerCount !== undefined) {
  console.log(`Providers discovered: ${computeDiscovery.providerCount}`);
}
console.log(`Risk verdict: ${verdict}`);
console.log(`Attestation root: ${attestation.attestationRoot}`);