import nextEnv from "@next/env";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ethers } from "ethers";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const rpcUrl = process.env.ORBIT_GALILEO_RPC_URL || "https://evmrpc-testnet.0g.ai";
const expectedChainId = BigInt(process.env.NEXT_PUBLIC_0G_CHAIN_ID || "16602");
const privateKey = process.env.ORBIT_DEPLOYER_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("ORBIT_DEPLOYER_PRIVATE_KEY is required in .env.local");
}

function readArtifact(contractName) {
  const artifactPrefix = `contracts_${contractName}_sol_${contractName}`;
  const abiPath = join("artifacts-solc", `${artifactPrefix}.abi`);
  const binPath = join("artifacts-solc", `${artifactPrefix}.bin`);

  if (!existsSync(abiPath) || !existsSync(binPath)) {
    throw new Error(`Missing ${contractName} artifact. Run npm run compile:contracts first.`);
  }

  return {
    abi: JSON.parse(readFileSync(abiPath, "utf8")),
    bytecode: `0x${readFileSync(binPath, "utf8").trim()}`
  };
}

function readArg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((value) => value.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function parseA0gi(value, fallback) {
  return ethers.parseEther(value || fallback);
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const network = await provider.getNetwork();

if (network.chainId !== expectedChainId) {
  throw new Error(`Unexpected chain id ${network.chainId}. Expected ${expectedChainId}.`);
}

const deployer = new ethers.Wallet(privateKey, provider);
const balance = await provider.getBalance(deployer.address);
const agentAddress = ethers.getAddress(process.env.ORBIT_AGENT_ADDRESS || deployer.address);
const initialFunding = parseA0gi(process.env.ORBIT_INITIAL_FUNDING_A0GI, "0.02");
const executeValue = parseA0gi(process.env.ORBIT_EXECUTE_VALUE_A0GI, "0.001");
const perTxCap = ethers.parseEther("0.05");
const dailyCap = ethers.parseEther("0.15");
const cooldownSeconds = 600;
const faucetTxHash = readArg("faucet-tx") || null;

if (balance < initialFunding + executeValue) {
  throw new Error(`Insufficient balance. Have ${ethers.formatEther(balance)} A0GI.`);
}

const orbitFactoryArtifact = readArtifact("OrbitFactory");
const orbitWalletArtifact = readArtifact("OrbitWallet");
const factoryFactory = new ethers.ContractFactory(orbitFactoryArtifact.abi, orbitFactoryArtifact.bytecode, deployer);

console.log(`Network: ${process.env.NEXT_PUBLIC_0G_NETWORK_NAME || "0G Galileo Testnet"} (${network.chainId})`);
console.log(`Deployer: ${deployer.address}`);
console.log(`Balance: ${ethers.formatEther(balance)} A0GI`);

const factory = await factoryFactory.deploy();
const factoryDeployTx = factory.deploymentTransaction();
await factory.waitForDeployment();
const factoryAddress = await factory.getAddress();

console.log(`OrbitFactory: ${factoryAddress}`);

const createOrbitTx = await factory.createOrbit(agentAddress, perTxCap, dailyCap, cooldownSeconds, { value: initialFunding });
const createOrbitReceipt = await createOrbitTx.wait();
const orbitCreatedLog = createOrbitReceipt.logs
  .map((log) => {
    try {
      return factory.interface.parseLog(log);
    } catch {
      return null;
    }
  })
  .find((event) => event?.name === "OrbitCreated");

if (!orbitCreatedLog) {
  throw new Error("OrbitCreated event was not found in createOrbit receipt.");
}

const orbitWalletAddress = orbitCreatedLog.args.wallet;
const orbitWallet = new ethers.Contract(orbitWalletAddress, orbitWalletArtifact.abi, deployer);
const setRecipientTx = await orbitWallet.setRecipient(deployer.address, true);
await setRecipientTx.wait();
const setSelectorTx = await orbitWallet.setSelector("0xa9059cbb", true);
await setSelectorTx.wait();

const receiptRoot = ethers.id("0g-orbit-galileo-demo-receipt-v1");
const executeTx = await orbitWallet.execute(deployer.address, executeValue, "0x", receiptRoot);
await executeTx.wait();
const rejectedReason = await orbitWallet.rejectionReason("0x000000000000000000000000000000000000dEaD", executeValue, "0x");

mkdirSync("deployments", { recursive: true });

const deployment = {
  project: "0G Orbit",
  network: process.env.NEXT_PUBLIC_0G_NETWORK_NAME || "0G Galileo Testnet",
  chainId: network.chainId.toString(),
  rpcUrl,
  faucetTxHash,
  deployer: deployer.address,
  agent: agentAddress,
  factoryAddress,
  orbitWalletAddress,
  policy: {
    perTxCapA0GI: ethers.formatEther(perTxCap),
    dailyCapA0GI: ethers.formatEther(dailyCap),
    cooldownSeconds
  },
  initialFundingA0GI: ethers.formatEther(initialFunding),
  demoExecuteValueA0GI: ethers.formatEther(executeValue),
  demoReceiptRoot: receiptRoot,
  demoRejectedReason: rejectedReason,
  transactions: {
    factoryDeployment: factoryDeployTx?.hash,
    createOrbit: createOrbitTx.hash,
    setRecipient: setRecipientTx.hash,
    setSelector: setSelectorTx.hash,
    executeAllowedOperation: executeTx.hash
  },
  deployedAt: new Date().toISOString()
};

writeFileSync(join("deployments", "galileo.json"), `${JSON.stringify(deployment, null, 2)}\n`);

console.log(`OrbitWallet: ${orbitWalletAddress}`);
console.log(`Allowed execution tx: ${executeTx.hash}`);
console.log(`Rejected reason sample: ${rejectedReason}`);
console.log("Deployment record: deployments/galileo.json");