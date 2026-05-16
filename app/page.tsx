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
  computeEvidence,
  demoOperations,
  formatAddress,
  formatReceiptTime,
  initialReceipts,
  policySnapshot,
  storageEvidence,
  walletProfile,
  type DemoOperation,
  type ReceiptStatus
} from "@/lib/orbit-demo";

const statusIcon: Record<ReceiptStatus, React.ReactNode> = {
  executed: <CheckCircle2 size={16} />,
  rejected: <XCircle size={16} />,
  simulated: <Activity size={16} />
};

const judgeSignals = [
  {
    label: "Live on Galileo",
    value: formatAddress(chainDeployment.executeTxHash, 10),
    detail: "Allowed execution visible on explorer",
    href: chainDeployment.links.executeTx
  },
  {
    label: "Receipt on 0G Storage",
    value: formatAddress(storageEvidence.rootHash, 10),
    detail: "Uploaded bundle root for replayable audit",
    href: chainDeployment.links.storageTx
  },
  {
    label: "Compute attestation",
    value: `${computeEvidence.providerCount} providers`,
    detail: `${computeEvidence.verdict} / score ${computeEvidence.riskScore}`
  }
];

const storyPoints = [
  {
    icon: <ShieldCheck size={18} />,
    title: "One clear promise",
    text: "The product thesis is visible in the first screen: useful agents, bounded authority, no private-key custody."
  },
  {
    icon: <Database size={18} />,
    title: "Proof before paragraphs",
    text: "Winning demos front-load explorer links, storage roots, and receipts instead of hiding them in docs or terminals."
  },
  {
    icon: <ClipboardCheck size={18} />,
    title: "A story judges can retell",
    text: "Persona, policy, action, rejection, evidence. The flow is memorable because it reads like one product story, not a feature list."
  }
];

const heroIntent = ["Policy envelope first", "Self-custodial by default", "Proof visible across 0G"];

const storyActs = [
  {
    step: "Act I",
    title: "Set a boundary, not a babysitter.",
    text: "The owner defines the operational envelope once: budget, allowlists, cooldowns, and emergency pause. The agent gets authority inside rules, not authority over the wallet."
  },
  {
    step: "Act II",
    title: "Let the agent do the routine work.",
    text: "The agent can propose real operations like contributor payouts and renewals. Allowed actions pass, unknown recipients and oversized payouts fail with an explicit reason."
  },
  {
    step: "Act III",
    title: "Prove every move across 0G.",
    text: "The execution is visible on Galileo, the receipt bundle lands on 0G Storage, and the risk attestation ties the operation back to a compute-assisted decision trail."
  }
];

const riskVerdictLabel = computeEvidence.verdict === "approve" ? "approved" : computeEvidence.verdict === "reject" ? "rejected" : computeEvidence.verdict;

const proofHighlights = [
  {
    label: "Galileo tx",
    value: formatAddress(chainDeployment.executeTxHash, 6),
    text: "Allowed execution is visible on the testnet explorer.",
    href: chainDeployment.links.executeTx
  },
  {
    label: "Storage root",
    value: formatAddress(storageEvidence.rootHash, 6),
    text: "Full receipt bundle is anchored for replayable audit."
  },
  {
    label: "Compute review",
    value: `${computeEvidence.providerCount} providers`,
    text: `${riskVerdictLabel} risk verdict with score ${computeEvidence.riskScore}.`
  }
];

const systemHighlights = [
  {
    label: "Wallet layer",
    value: "Policy gate",
    text: "The contract enforces caps, allowlists, cooldowns, and pause."
  },
  {
    label: "Data layer",
    value: "Receipts",
    text: "Storage keeps reasoning, invoices, policies, and outcomes together."
  },
  {
    label: "Agent layer",
    value: "Bounded ID",
    text: "The agent can act only through delegated, revocable authority."
  }
];

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
      <div className="page-orb page-orb-one" aria-hidden="true" />
      <div className="page-orb page-orb-two" aria-hidden="true" />

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

      <section className="hero-grid" aria-label="Product introduction">
        <div className="hero-copy">
          <div className="hero-copy-shell">
            <div className="hero-ambient" aria-hidden="true">
              <span className="ambient-ring ambient-ring-one" />
              <span className="ambient-ring ambient-ring-two" />
              <span className="ambient-beam" />
              <span className="ambient-dot ambient-dot-one" />
              <span className="ambient-dot ambient-dot-two" />
            </div>

            <div className="hero-copy-body">
              <span className="hero-kicker">Track 3 / Operational tooling for the agentic economy</span>
              <h1>
                Let AI agents operate.
                <span>Keep the wallet in orbit.</span>
              </h1>
              <p>
                0G Orbit gives DAOs a self-custodial operational wallet for autonomous agents. Agents can pay, renew, and execute inside owner-defined
                policy bounds, while every action stays provable across 0G Chain, Storage, and Compute.
              </p>

              <div className="hero-intent-strip" aria-label="Product positioning">
                {heroIntent.map((item) => (
                  <span key={item} className="intent-chip">
                    {item}
                  </span>
                ))}
              </div>

              <div className="hero-actions">
                <a className="primary-button" href="#operations">
                  <ArrowRight size={17} />
                  Explore live flow
                </a>
                <a className="ghost-button" href={chainDeployment.links.executeTx} target="_blank" rel="noreferrer">
                  <ExternalLink size={17} />
                  Open Galileo proof
                </a>
              </div>
            </div>

            <div className="hero-signals" role="list" aria-label="Judge proof signals">
              {judgeSignals.map((signal) => (
                <HeroSignal key={signal.label} {...signal} />
              ))}
            </div>
          </div>
        </div>

        <div className="hero-spotlight">
          <article className="spotlight-card spotlight-primary">
            <div className="spotlight-header">
              <span className="spotlight-badge">Live deployment</span>
              <span className="spotlight-pill">0G Galileo / {chainDeployment.chainId}</span>
            </div>
            <h2>{walletProfile.name}</h2>
            <p>Keep AI agents in orbit, not in custody.</p>

            <div className="spotlight-stats">
              <SpotlightStat label="Wallet balance" value={`${walletProfile.balance} A0GI`} />
              <SpotlightStat label="Authorized agent" value={walletProfile.agentName} />
              <SpotlightStat label="Orbit wallet" value={formatAddress(chainDeployment.orbitWalletAddress, 8)} />
              <SpotlightStat label="Storage status" value={storageEvidence.status} />
            </div>
          </article>

          <article className="spotlight-card spotlight-secondary">
            <div className="spotlight-header">
              <span className="spotlight-badge">Selected operation</span>
              <span className={canExecute ? "verdict allowed" : "verdict rejected"}>
                {canExecute ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {canExecute ? "Executable" : "Blocked"}
              </span>
            </div>
            <h3>{selectedOperation.title}</h3>
            <p>{selectedOperation.agentReasoning}</p>
            <dl className="spotlight-facts">
              <div>
                <dt>Recipient</dt>
                <dd>{selectedOperation.recipient}</dd>
              </div>
              <div>
                <dt>Risk</dt>
                <dd>{selectedOperation.riskLevel}</dd>
              </div>
              <div>
                <dt>Policy</dt>
                <dd>{paused ? "Paused by owner" : selectedOperation.reason}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section className="story-strip" aria-label="Why the interface works for judges">
        <div className="section-heading">
          <span>What strong hackathon demos do well</span>
          <h2>They show one thesis, one interaction loop, and one proof chain in the first minute.</h2>
        </div>
        <div className="story-grid">
          {storyPoints.map((point) => (
            <StoryPoint key={point.title} {...point} />
          ))}
        </div>
      </section>

      <section className="narrative-stage section-shell section-shell-amber" aria-label="Product story arc">
        <div className="section-heading stage-heading">
          <span>Three acts</span>
          <h2>Turn a risky agent wallet story into a sequence judges can follow without effort.</h2>
        </div>
        <div className="act-grid">
          {storyActs.map((act, index) => (
            <article key={act.step} className="act-card">
              <div className="act-card-topline">
                <span>{act.step}</span>
                <strong>{`0${index + 1}`}</strong>
              </div>
              <h3>{act.title}</h3>
              <p>{act.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase-stage section-shell section-shell-forest" aria-labelledby="operations-heading">
        <div className="stage-rail">
          <span>Interactive core</span>
          <h2 id="operations-heading">Show the product doing one believable job from proposal to policy check.</h2>
          <p>
            This section is the live loop judges actually remember. The owner has already set the envelope. The agent now attempts useful operations and Orbit
            either executes or refuses them with a reason.
          </p>
          <div className="rail-note">
            <strong>Demo persona</strong>
            <p>DAO ops lead delegating routine contributor payments and renewals without surrendering custody.</p>
          </div>
        </div>

        <div className="stage-main">
          <div className="dashboard-grid" aria-label="0G Orbit dashboard">
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
                  <MonospaceValue value={formatAddress(walletProfile.owner)} compact />
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

            <Panel className="policy-panel" eyebrow="Policy envelope" title="Active Bounds">
              <div className="policy-list">
                <PolicyItem icon={<CircleDollarSign size={17} />} label="Per transaction cap" value={`${policySnapshot.perTxCap} A0GI`} />
                <PolicyItem icon={<Activity size={17} />} label="Daily budget" value={`${policySnapshot.dailyCap} A0GI`} />
                <PolicyItem icon={<BadgeCheck size={17} />} label="Allowed recipients" value={`${policySnapshot.allowedRecipients.length}`} />
                <PolicyItem icon={<KeyRound size={17} />} label="Allowed selectors" value={`${policySnapshot.allowedSelectors.length}`} />
                <PolicyItem icon={<RefreshCw size={17} />} label="Cooldown" value={`${policySnapshot.cooldownMinutes} min`} />
              </div>
            </Panel>

            <Panel className="operation-panel" eyebrow="Agent run panel" title="Operation Simulator" id="operations">
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
          </div>
        </div>
      </section>

      <section className="evidence-stage section-shell section-shell-blue" aria-labelledby="evidence-heading">
        <div className="section-heading stage-heading balanced-heading">
          <div className="stage-heading-copy">
            <span>Proof stack</span>
            <h2 id="evidence-heading">Once the interaction lands, prove it across chain, storage, and compute in one clean sweep.</h2>
          </div>
          <div className="stage-metric-grid" aria-label="Proof highlights">
            {proofHighlights.map((item) => (
              <StageMetric key={item.label} {...item} />
            ))}
          </div>
        </div>

        <div className="evidence-layout">
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
                <code>
                  <MonospaceValue value={formatAddress(receipt.receiptRoot, 10)} compact />
                </code>
              </article>
            ))}
          </div>
          </Panel>

          <div className="proof-column">
            <Panel className="proof-panel" eyebrow="Galileo proof" title="Live Deployment">
              <div className="proof-grid">
                <ProofItem label="Chain" value={`${chainDeployment.network} / ${chainDeployment.chainId}`} href={chainDeployment.explorerUrl} />
                <ProofItem label="Factory" value={formatAddress(chainDeployment.factoryAddress, 8)} href={chainDeployment.links.factory} />
                <ProofItem label="Orbit Wallet" value={formatAddress(chainDeployment.orbitWalletAddress, 8)} href={chainDeployment.links.orbitWallet} />
                <ProofItem label="Allowed Tx" value={formatAddress(chainDeployment.executeTxHash, 10)} href={chainDeployment.links.executeTx} />
                <ProofItem label="Rejected Sample" value={chainDeployment.rejectedReason} />
                <ProofItem label="Faucet Tx" value={formatAddress(chainDeployment.faucetTxHash ?? "", 10)} href={chainDeployment.links.faucetTx} />
              </div>
            </Panel>

            <Panel className="evidence-panel" eyebrow="0G Storage + Compute" title="Receipt Evidence">
              <div className="evidence-grid">
                <EvidenceItem label="Storage" value={`${storageEvidence.status} / ${storageEvidence.mode}`} />
                <EvidenceItem label="Storage Root" value={formatAddress(storageEvidence.rootHash, 10)} />
                <EvidenceItem label="Storage Tx" value={formatAddress(storageEvidence.txHash ?? "", 10)} href={chainDeployment.links.storageTx} />
                <EvidenceItem label="Compute Providers" value={`${computeEvidence.providerCount} discovered`} />
                <EvidenceItem label="Risk Verdict" value={`${computeEvidence.verdict} / score ${computeEvidence.riskScore}`} />
                <EvidenceItem label="Attestation Root" value={formatAddress(computeEvidence.attestationRoot, 10)} />
              </div>
            </Panel>
          </div>
        </div>
      </section>

      <section className="integration-stage section-shell section-shell-sand" aria-labelledby="integration-heading">
        <div className="section-heading stage-heading balanced-heading">
          <div className="stage-heading-copy">
            <span>System picture</span>
            <h2 id="integration-heading">End the page by showing the whole machine, not by dumping more controls.</h2>
          </div>
          <div className="stage-metric-grid" aria-label="System highlights">
            {systemHighlights.map((item) => (
              <StageMetric key={item.label} {...item} />
            ))}
          </div>
        </div>

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

function Panel({ eyebrow, title, className = "", children, id }: { eyebrow: string; title: string; className?: string; children: React.ReactNode; id?: string }) {
  return (
    <section className={`panel ${className}`} id={id}>
      <div className="panel-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function HeroSignal({ label, value, detail, href }: { label: string; value: string; detail: string; href?: string }) {
  const content = (
    <>
      <span>{label}</span>
      <MonospaceValue value={value} as="strong" />
      <p>{detail}</p>
    </>
  );

  return href ? (
    <a className="hero-signal" href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <article className="hero-signal">{content}</article>
  );
}

function SpotlightStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="spotlight-stat">
      <span>{label}</span>
      <MonospaceValue value={value} as="strong" compact />
    </div>
  );
}

function StoryPoint({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="story-card">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
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

function MonospaceValue({ value, as = "span", compact = false }: { value: string; as?: "span" | "strong"; compact?: boolean }) {
  const Component = as;

  return <Component className={compact ? "mono-value compact" : "mono-value"}>{value}</Component>;
}

function ProofItem({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="proof-item">
      <dt>{label}</dt>
      <dd>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" title={`Open ${label} proof`}>
            <ExternalLink size={14} />
            <MonospaceValue value={value} />
          </a>
        ) : (
          <MonospaceValue value={value} />
        )}
      </dd>
    </div>
  );
}

function EvidenceItem({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="evidence-item">
      <dt>{label}</dt>
      <dd>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" title={`Open ${label} proof`}>
            <ExternalLink size={14} />
            <MonospaceValue value={value} />
          </a>
        ) : (
          <MonospaceValue value={value} />
        )}
      </dd>
    </div>
  );
}

function StageMetric({ label, value, text, href }: { label: string; value: string; text: string; href?: string }) {
  const content = (
    <>
      <span>{label}</span>
      <MonospaceValue value={value} as="strong" compact />
      <p>{text}</p>
    </>
  );

  return href ? (
    <a className="stage-metric-card" href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <article className="stage-metric-card">{content}</article>
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
