"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Ban,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileText,
  KeyRound,
  Orbit,
  Pause,
  Play,
  RadioTower,
  RefreshCw,
  ShieldCheck,
  WalletCards,
  XCircle
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  chainDeployment,
  demoOperations,
  formatAddress,
  formatReceiptTime,
  initialReceipts,
  policySnapshot,
  walletProfile,
  type DemoOperation,
  type ReceiptStatus
} from "@/lib/orbit-demo";

const statusIcon: Record<ReceiptStatus, React.ReactNode> = {
  executed: <CheckCircle2 size={16} />,
  rejected: <XCircle size={16} />,
  simulated: <Activity size={16} />
};

export default function Home() {
  const [selectedOperationId, setSelectedOperationId] = useState(demoOperations[0].id);
  const [receipts, setReceipts] = useState(initialReceipts);
  const [paused, setPaused] = useState(false);
  const selectedOperation = useMemo(
    () => demoOperations.find((operation) => operation.id === selectedOperationId) ?? demoOperations[0],
    [selectedOperationId]
  );

  const canExecute = selectedOperation.expectedStatus === "allowed" && !paused;

  function runOperation(operation: DemoOperation) {
    const blockedByPause = paused;
    const status: ReceiptStatus = blockedByPause || operation.expectedStatus === "rejected" ? "rejected" : "executed";
    const reason = blockedByPause ? "Wallet is paused by owner" : operation.reason;
    const rootSeed = `${operation.id}-${Date.now()}-${status}`;
    const receiptRoot = `0x${Array.from(rootSeed)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 64)
      .padEnd(64, "0")}`;

    setReceipts((current) => [
      {
        id: `${operation.id}-${current.length + 1}`,
        title: operation.title,
        status,
        amount: operation.amount,
        recipient: operation.recipient,
        reason,
        receiptRoot,
        timestamp: new Date().toISOString(),
        policyHash: policySnapshot.policyHash
      },
      ...current
    ]);
  }

  return (
    <main className="page-shell">
      <section className="topbar" aria-label="Project header">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <Orbit size={22} />
          </span>
          <div>
            <h1>0G Orbit</h1>
            <p>Keep AI agents in orbit, not in custody.</p>
          </div>
        </div>
        <div className="network-pill" title="Target deployment network">
          <RadioTower size={16} />
          <span>Galileo Testnet</span>
        </div>
      </section>

      <section className="dashboard-grid" aria-label="0G Orbit dashboard">
        <Panel className="wallet-panel" eyebrow="Self-custodial wallet" title="DAO Ops Orbit">
          <div className="wallet-summary">
            <div>
              <span className="metric-label">Wallet Balance</span>
              <strong>{walletProfile.balance} A0GI</strong>
            </div>
            <div>
              <span className="metric-label">Authorized Agent</span>
              <strong>{walletProfile.agentName}</strong>
            </div>
            <div>
              <span className="metric-label">Owner</span>
              <strong>{formatAddress(walletProfile.owner)}</strong>
            </div>
          </div>

          <div className="control-row">
            <button className="primary-button" type="button" title="Create a mock Orbit wallet">
              <WalletCards size={17} />
              Create Orbit
            </button>
            <button
              className={paused ? "success-button" : "ghost-button"}
              type="button"
              title={paused ? "Resume bounded agent operations" : "Pause all agent operations"}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <Play size={17} /> : <Pause size={17} />}
              {paused ? "Resume" : "Pause"}
            </button>
          </div>

          <div className={paused ? "status-banner danger" : "status-banner safe"}>
            {paused ? <Ban size={18} /> : <ShieldCheck size={18} />}
            <span>{paused ? "Agent execution is paused by owner." : "Agent may operate only inside active policy bounds."}</span>
          </div>
        </Panel>

        <Panel eyebrow="Policy envelope" title="Active Bounds">
          <div className="policy-list">
            <PolicyItem icon={<CircleDollarSign size={17} />} label="Per transaction cap" value={`${policySnapshot.perTxCap} A0GI`} />
            <PolicyItem icon={<Activity size={17} />} label="Daily budget" value={`${policySnapshot.dailyCap} A0GI`} />
            <PolicyItem icon={<BadgeCheck size={17} />} label="Allowed recipients" value={`${policySnapshot.allowedRecipients.length}`} />
            <PolicyItem icon={<KeyRound size={17} />} label="Allowed selectors" value={`${policySnapshot.allowedSelectors.length}`} />
            <PolicyItem icon={<RefreshCw size={17} />} label="Cooldown" value={`${policySnapshot.cooldownMinutes} min`} />
          </div>
        </Panel>

        <Panel className="operation-panel" eyebrow="Agent run panel" title="Operation Simulator">
          <div className="operation-list" role="list" aria-label="Demo operations">
            {demoOperations.map((operation) => (
              <button
                key={operation.id}
                type="button"
                className={selectedOperation.id === operation.id ? "operation-card selected" : "operation-card"}
                onClick={() => setSelectedOperationId(operation.id)}
                title={operation.reason}
              >
                <span className={operation.expectedStatus === "allowed" ? "dot allowed" : "dot rejected"} />
                <span>{operation.title}</span>
                <strong>{operation.amount} A0GI</strong>
              </button>
            ))}
          </div>

          <div className="operation-detail">
            <div className="detail-heading">
              <div>
                <span className="metric-label">Selected operation</span>
                <h3>{selectedOperation.title}</h3>
              </div>
              <span className={canExecute ? "verdict allowed" : "verdict rejected"}>
                {canExecute ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {canExecute ? "Executable" : "Blocked"}
              </span>
            </div>
            <p>{selectedOperation.agentReasoning}</p>
            <dl className="detail-grid">
              <div>
                <dt>Recipient</dt>
                <dd>{selectedOperation.recipient}</dd>
              </div>
              <div>
                <dt>Risk</dt>
                <dd>{selectedOperation.riskLevel}</dd>
              </div>
              <div>
                <dt>Policy result</dt>
                <dd>{paused ? "Paused" : selectedOperation.reason}</dd>
              </div>
            </dl>
            <button className="primary-button wide" type="button" onClick={() => runOperation(selectedOperation)} title="Run selected operation">
              <ArrowRight size={17} />
              Run Operation
            </button>
          </div>
        </Panel>

        <Panel className="receipt-panel" eyebrow="0G receipts" title="Audit Trail">
          <div className="receipt-list" role="list" aria-label="Operation receipts">
            {receipts.map((receipt) => (
              <article key={receipt.id} className={`receipt-card ${receipt.status}`}>
                <div className="receipt-topline">
                  <span className="receipt-status">
                    {statusIcon[receipt.status]}
                    {receipt.status}
                  </span>
                  <time>{formatReceiptTime(receipt.timestamp)}</time>
                </div>
                <h3>{receipt.title}</h3>
                <p>{receipt.reason}</p>
                <div className="receipt-meta">
                  <span>{receipt.amount} A0GI</span>
                  <span>{receipt.recipient}</span>
                </div>
                <code>{formatAddress(receipt.receiptRoot, 10)}</code>
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="proof-panel" eyebrow="Galileo proof" title="Live Deployment">
          <div className="proof-grid">
            <ProofItem label="Chain" value={`${chainDeployment.network} / ${chainDeployment.chainId}`} />
            <ProofItem label="Factory" value={formatAddress(chainDeployment.factoryAddress, 8)} />
            <ProofItem label="Orbit Wallet" value={formatAddress(chainDeployment.orbitWalletAddress, 8)} />
            <ProofItem label="Allowed Tx" value={formatAddress(chainDeployment.executeTxHash, 10)} />
            <ProofItem label="Rejected Sample" value={chainDeployment.rejectedReason} />
            <ProofItem label="Faucet Tx" value={formatAddress(chainDeployment.faucetTxHash ?? "", 10)} />
          </div>
        </Panel>

        <Panel className="integration-panel" eyebrow="0G integration map" title="From Mock to Testnet">
          <div className="integration-grid">
            <IntegrationItem icon={<ShieldCheck size={18} />} title="0G Chain" text="OrbitWallet, policy updates, execution events, receipt roots." />
            <IntegrationItem icon={<Database size={18} />} title="0G Storage" text="Full receipt bundles, invoices, policy snapshots, agent reasoning." />
            <IntegrationItem icon={<ClipboardCheck size={18} />} title="0G Compute" text="Operation planning and risk review, mocked first and replaced later." />
            <IntegrationItem icon={<FileText size={18} />} title="Agent ID" text="Authorized agent identity bound to wallet execution authority." />
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Panel({ eyebrow, title, className = "", children }: { eyebrow: string; title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function PolicyItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="policy-item">
      <span>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function ProofItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="proof-item">
      <dt>{label}</dt>
      <dd>
        <ExternalLink size={14} />
        <span>{value}</span>
      </dd>
    </div>
  );
}

function IntegrationItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="integration-item">
      <span>{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
