import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { Wallet } from "ethers";

const envPath = ".env.local";
const wallet = Wallet.createRandom();

let existing = "";
if (existsSync(envPath)) {
  existing = readFileSync(envPath, "utf8");
}

const withoutOldOrbitKeys = existing
  .split(/\r?\n/)
  .filter((line) => !line.startsWith("ORBIT_DEPLOYER_PRIVATE_KEY=") && !line.startsWith("ORBIT_DEPLOYER_ADDRESS="))
  .join("\n")
  .trim();

const nextEnv = `${withoutOldOrbitKeys ? `${withoutOldOrbitKeys}\n` : ""}NEXT_PUBLIC_0G_NETWORK_NAME="0G Galileo Testnet"
NEXT_PUBLIC_0G_CHAIN_ID="16602"
NEXT_PUBLIC_ORBIT_DEMO_MODE="mock"
ORBIT_DEPLOYER_ADDRESS="${wallet.address}"
ORBIT_DEPLOYER_PRIVATE_KEY="${wallet.privateKey}"
`;

writeFileSync(envPath, nextEnv);

console.log(`Created Galileo test wallet: ${wallet.address}`);
console.log("Private key was written to .env.local, which is gitignored. Use this wallet for testnet only.");
