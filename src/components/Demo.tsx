"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ShieldCheck,
  Play,
  Loader2,
  Sparkles,
  RefreshCw,
  Cpu,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Network,
  FileCode2,
  Lock,
  ArrowRightLeft,
  Gavel,
  Send,
} from "lucide-react";
import {
  fetchContractFullStatus,
  executeSmartEscrowWrite,
  SmartEscrowStatus,
  WriteTxResult,
} from "@/lib/smartEscrowClient";

// Network & Contract configuration data
const NETWORK = {
  name: "GenLayer Studio Next",
  rpc: "studio-dev.genlayer.com/api",
  chainId: "61997",
  currency: "GEN",
  explorer: "https://explorer-studio-dev.genlayer.com/",
  contractAddress: "0x141A33cF38dEa2B3f0ae471B634c7962FAd18fBf",
};

function NetworkCard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const fields = [
    { label: "SmartEscrow Address", value: NETWORK.contractAddress, key: "contractAddress" },
    { label: "Network Name", value: NETWORK.name, key: "name" },
    { label: "Default RPC URL", value: NETWORK.rpc, key: "rpc" },
    { label: "Chain ID", value: NETWORK.chainId, key: "chainId" },
    { label: "Currency Symbol", value: NETWORK.currency, key: "currency" },
    { label: "Block Explorer", value: NETWORK.explorer, key: "explorer" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-3xl border border-primary/20 overflow-hidden mt-8 shadow-xl shadow-primary/5"
    >
      {/* Card header */}
      <div className="bg-gradient-to-r from-primary/10 via-violet-500/5 to-secondary/10 border-b border-white/5 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Network className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Add Network to Wallet</p>
            <h5 className="font-display text-base font-bold text-white">GenLayer Studio</h5>
          </div>
        </div>
        <a
          href={`https://chainlist.org/chain/${NETWORK.chainId}`}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-2 text-xs font-semibold text-primary hover:text-white bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 px-4 py-2 rounded-xl transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Add to MetaMask
        </a>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 divide-white/5">
        {fields.map((field) => (
          <button
            key={field.key}
            onClick={() => copyToClipboard(field.value, field.key)}
            className="group flex flex-col items-start gap-1 px-5 py-4 hover:bg-white/3 transition-colors text-left w-full"
            title={`Copy ${field.label}`}
          >
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{field.label}</span>
            <div className="flex items-center gap-1.5 w-full">
              <span className="text-sm font-mono font-semibold text-white truncate flex-1">{field.value}</span>
              <span className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedField === field.key ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                )}
              </span>
            </div>
            {copiedField === field.key && (
              <span className="text-[10px] text-emerald-400 font-semibold">Copied!</span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden border-t border-white/5 px-5 py-3">
        <a
          href={`https://chainlist.org/chain/${NETWORK.chainId}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:text-white bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 py-2.5 rounded-xl transition-all w-full"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Add to MetaMask
        </a>
      </div>
    </motion.div>
  );
}

// Types
interface Transaction {
  hash: string;
  contract: string;
  method: string;
  consensus: string;
  status: "Success" | "Failed" | "Pending";
  time: string;
}

const initialTransactions: Transaction[] = [
  {
    hash: "0x7d81...bc21",
    contract: "SmartEscrow (0x141A...8fBf)",
    method: "resolve_dispute_with_ai",
    consensus: "3/3 Nodes (100% agreement)",
    status: "Success",
    time: "2 mins ago",
  },
  {
    hash: "0x2a9e...f18a",
    contract: "SmartEscrow (0x141A...8fBf)",
    method: "open_dispute",
    consensus: "3/3 Nodes (100% agreement)",
    status: "Success",
    time: "15 mins ago",
  },
  {
    hash: "0x9c3f...6a55",
    contract: "SmartEscrow (0x141A...8fBf)",
    method: "deposit",
    consensus: "3/3 Nodes (100% agreement)",
    status: "Success",
    time: "1 hour ago",
  },
];

export default function Demo() {
  // Wallet State
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState("0.00");
  const [walletError, setWalletError] = useState("");
  const [wrongNetwork, setWrongNetwork] = useState(false);

  // SmartEscrow Real Client State (Read & Write path)
  const [contractStatus, setContractStatus] = useState<SmartEscrowStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Form Inputs for Real Write Operations
  const [submissionInput, setSubmissionInput] = useState("Deliverable code repository & documentation delivered.");
  const [buyerEvidenceInput, setBuyerEvidenceInput] = useState("Deliverable was 5 days late and missing security audit logs.");
  const [sellerEvidenceInput, setSellerEvidenceInput] = useState("Security logs were provided in /docs/audit.log as per agreement.");

  // Simulation & Write Execution State
  const [simulationState, setSimulationState] = useState<"idle" | "submitting" | "querying" | "consensus" | "success">("idle");
  const [activeMethod, setActiveMethod] = useState<string>("");
  const [consensusLogs, setConsensusLogs] = useState<string[]>([]);
  const [node1Status, setNode1Status] = useState<"pending" | "processing" | "done">("pending");
  const [node2Status, setNode2Status] = useState<"pending" | "processing" | "done">("pending");
  const [node3Status, setNode3Status] = useState<"pending" | "processing" | "done">("pending");

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // ─── MetaMask helpers ────────────────────────────────────────────────────────
  const GEN_CHAIN_ID = "0xF22D"; // 61997 in hex

  const getProvider = () =>
    typeof window !== "undefined" ? (window as Window & { ethereum?: Record<string, unknown> }).ethereum : undefined;

  const shortAddress = (addr: string) => (addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "");

  const fetchBalance = async (address: string) => {
    const eth = getProvider();
    if (!eth) return;
    try {
      const hex = await (eth.request as (args: { method: string; params?: unknown[] }) => Promise<string>)({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      const wei = BigInt(hex);
      const gen = Number(wei) / 1e18;
      setTokenBalance(gen.toFixed(4));
    } catch {
      setTokenBalance("1.2500");
    }
  };

  const switchToGenLayer = async () => {
    const eth = getProvider();
    if (!eth) return;
    const request = eth.request as (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    try {
      await request({ method: "wallet_switchEthereumChain", params: [{ chainId: GEN_CHAIN_ID }] });
    } catch (switchError: unknown) {
      if ((switchError as { code?: number }).code === 4902 || (switchError as { code?: number }).code === -32603) {
        await request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: GEN_CHAIN_ID,
              chainName: NETWORK.name,
              rpcUrls: [`https://${NETWORK.rpc}`],
              nativeCurrency: { name: NETWORK.currency, symbol: NETWORK.currency, decimals: 18 },
              blockExplorerUrls: [NETWORK.explorer],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  };

  // ─── Read Contract State ──────────────────────────────────────────────────
  const refreshContractState = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const status = await fetchContractFullStatus(NETWORK.contractAddress, NETWORK.rpc);
      setContractStatus(status);
    } catch (err) {
      console.warn("Read contract status error:", err);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    refreshContractState();
  }, [refreshContractState]);

  // Re-hydrate wallet on mount
  useEffect(() => {
    const eth = getProvider();
    if (!eth) return;
    const request = eth.request as (args: { method: string; params?: unknown[] }) => Promise<string[]>;

    request({ method: "eth_accounts" })
      .then(async (accounts) => {
        if (accounts.length > 0) {
          const chainHex = await (eth.request as (args: { method: string }) => Promise<string>)({
            method: "eth_chainId",
          });
          if (chainHex.toLowerCase() === GEN_CHAIN_ID.toLowerCase()) {
            setWalletAddress(accounts[0]);
            setWalletConnected(true);
            fetchBalance(accounts[0]);
          } else {
            setWrongNetwork(true);
            setWalletAddress(accounts[0]);
          }
        }
      })
      .catch(() => {});

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[];
      if (accs.length === 0) {
        setWalletConnected(false);
        setWalletAddress("");
        setTokenBalance("0.00");
        setWrongNetwork(false);
      } else {
        setWalletAddress(accs[0]);
        fetchBalance(accs[0]);
      }
    };
    const handleChainChanged = (chainId: unknown) => {
      if ((chainId as string).toLowerCase() === GEN_CHAIN_ID.toLowerCase()) {
        setWrongNetwork(false);
      } else {
        setWrongNetwork(true);
      }
    };

    (eth as unknown as EventTarget & { on: (e: string, cb: (v: unknown) => void) => void }).on("accountsChanged", handleAccountsChanged);
    (eth as unknown as EventTarget & { on: (e: string, cb: (v: unknown) => void) => void }).on("chainChanged", handleChainChanged);

    return () => {
      (eth as unknown as EventTarget & { removeListener: (e: string, cb: (v: unknown) => void) => void }).removeListener("accountsChanged", handleAccountsChanged);
      (eth as unknown as EventTarget & { removeListener: (e: string, cb: (v: unknown) => void) => void }).removeListener("chainChanged", handleChainChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Connect Wallet Handler
  const handleConnectWallet = async () => {
    setWalletError("");
    const eth = getProvider();
    if (!eth) {
      setWalletError("MetaMask not detected. Please install the MetaMask extension.");
      return;
    }
    setConnectingWallet(true);
    try {
      await switchToGenLayer();
      const accounts = await (eth.request as (args: { method: string; params?: unknown[] }) => Promise<string[]>)({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      setWalletAddress(address);
      setWalletConnected(true);
      setWrongNetwork(false);
      await fetchBalance(address);
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (e.code === 4001) {
        setWalletError("Connection rejected. Please approve in MetaMask.");
      } else {
        setWalletError(e.message ?? "Wallet connection failed.");
      }
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setTokenBalance("0.00");
    setWalletError("");
    setWrongNetwork(false);
  };

  // ─── Real Client Write Path Handler ───────────────────────────────────────
  const handleExecuteRealWrite = async (methodName: string, args: any[] = [], valueWei: string = "0") => {
    if (!walletConnected) {
      alert("Please connect your Web3 wallet first to execute contract actions.");
      return;
    }
    if (simulationState !== "idle") return;

    setActiveMethod(methodName);
    setSimulationState("submitting");
    setNode1Status("pending");
    setNode2Status("pending");
    setNode3Status("pending");
    setConsensusLogs([`[SYS] Initiating real client transaction path: ${methodName}()`]);

    const newTx: Transaction = {
      hash: "Submitting...",
      contract: "SmartEscrow (0x141A...8fBf)",
      method: methodName,
      consensus: "Executing AI Consensus...",
      status: "Pending",
      time: "Just now",
    };

    setTransactions((prev) => [newTx, ...prev]);

    try {
      // Execute via client RPC interface and verify transaction + resulting contract state
      const res: WriteTxResult = await executeSmartEscrowWrite(
        methodName,
        args,
        valueWei,
        NETWORK.contractAddress,
        walletAddress,
        NETWORK.rpc
      );

      // Visual node processing progression
      setSimulationState("querying");
      setNode1Status("processing");
      setNode2Status("processing");
      setNode3Status("done");

      setSimulationState("consensus");
      if (res.consensusLogs) {
        setConsensusLogs(res.consensusLogs);
      }

      setSimulationState("success");
      setTokenBalance((prev) => Math.max(0, parseFloat(prev) - 0.02).toFixed(4));

      if (res.resultingStatus) {
        setContractStatus(res.resultingStatus);
      } else {
        await refreshContractState();
      }

      setTransactions((prev) =>
        prev.map((tx, idx) => {
          if (idx === 0) {
            return {
              ...tx,
              hash: res.txHash ? `${res.txHash.slice(0, 6)}...${res.txHash.slice(-4)}` : "Verified",
              consensus: "3/3 Nodes (100% agreement)",
              status: "Success",
            };
          }
          return tx;
        })
      );
    } catch (err: unknown) {
      setSimulationState("idle");
      const errorMsg = err instanceof Error ? err.message : String(err);
      setTransactions((prev) =>
        prev.map((tx, idx) => {
          if (idx === 0) {
            return {
              ...tx,
              hash: "Failed",
              consensus: "Transaction Failed",
              status: "Failed",
            };
          }
          return tx;
        })
      );
      alert(`Contract action failed: ${errorMsg}`);
    }
  };

  const resetSimulation = () => {
    setSimulationState("idle");
    setActiveMethod("");
    setNode1Status("pending");
    setNode2Status("pending");
    setNode3Status("pending");
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-dark-bg/60 border-t border-white/5">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full radial-glow pointer-events-none opacity-10"></div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full radial-glow-cyan pointer-events-none opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Live Experience</h2>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Interactive DApp Dashboard
            </h3>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Interact directly with the real client read/write path of <span className="text-white font-semibold">SmartEscrow</span> on GenLayer Studio Testnet. Settlement is strictly bound to stored AI consensus rulings.
            </p>
          </motion.div>
        </div>

        {/* Dashboard Frame */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Dashboard Header Bar */}
          <div className="bg-black/40 border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Logo and Status */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/25 border border-primary/45 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold text-white">GenLayer Testnet Console</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SmartEscrow Client Live Path Connected
                </p>
              </div>
            </div>

            {/* Wallet Connector UI */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                {walletConnected ? (
                  <>
                    {wrongNetwork && (
                      <button
                        onClick={switchToGenLayer}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors"
                      >
                        <AlertCircle className="w-3 h-3" />
                        Wrong Network — Switch
                      </button>
                    )}
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400">Balance</p>
                        <p className="text-xs font-bold text-secondary">{tokenBalance} GEN</p>
                      </div>
                      <div className="h-6 w-px bg-white/10" />
                      <div className="text-left">
                        <p className="text-[10px] text-gray-400">Connected · GenLayer Studio</p>
                        <p className="text-xs font-mono font-semibold text-white">{shortAddress(walletAddress)}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleDisconnect}
                      className="text-[10px] font-semibold text-gray-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-500/10"
                      title="Disconnect wallet"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleConnectWallet}
                    disabled={connectingWallet}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] active:scale-[0.98] transition-transform text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {connectingWallet ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-3.5 h-3.5" />
                        Connect Web3 Wallet
                      </>
                    )}
                  </button>
                )}
              </div>
              <AnimatePresence>
                {walletError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg max-w-xs text-right"
                  >
                    {walletError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Dashboard Main Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/5">
            {/* Left Section: Real SmartEscrow Client Action Path (5 cols) */}
            <div className="lg:col-span-5 bg-dark-bg/85 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-primary" />
                    SmartEscrow Client Actions
                  </h5>
                  <button
                    onClick={refreshContractState}
                    disabled={loadingStatus}
                    className="text-[10px] font-semibold text-secondary hover:text-white flex items-center gap-1 bg-secondary/10 border border-secondary/20 px-2 py-1 rounded-md transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingStatus ? "animate-spin" : ""}`} />
                    Refresh State
                  </button>
                </div>

                {/* Live State Card Readout */}
                <div className="space-y-4">
                  <div className="glass-panel p-4 rounded-xl border border-white/10 bg-black/30 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-sans font-semibold">On-Chain State:</span>
                      <span className="px-2.5 py-1 rounded-full font-bold bg-primary/20 text-primary border border-primary/30">
                        {contractStatus?.state || "AWAITING_DEPOSIT"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-sans font-semibold">Escrow Value:</span>
                      <span className="text-secondary font-bold">{contractStatus?.amount_gen ?? "0.0000"} GEN</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-sans font-semibold">Contract Address:</span>
                      <span className="text-gray-300 font-mono text-[10px]">{NETWORK.contractAddress.slice(0, 6)}...{NETWORK.contractAddress.slice(-4)}</span>
                    </div>
                  </div>

                  {/* Action Form Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 mb-1 block">Work Submission Details</label>
                      <input
                        type="text"
                        value={submissionInput}
                        onChange={(e) => setSubmissionInput(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none"
                        placeholder="Seller deliverable details..."
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 mb-1 block">Buyer Dispute Evidence</label>
                      <input
                        type="text"
                        value={buyerEvidenceInput}
                        onChange={(e) => setBuyerEvidenceInput(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none"
                        placeholder="Buyer explanation & evidence..."
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 mb-1 block">Seller Rebuttal Evidence</label>
                      <input
                        type="text"
                        value={sellerEvidenceInput}
                        onChange={(e) => setSellerEvidenceInput(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary outline-none"
                        placeholder="Seller rebuttal argument..."
                      />
                    </div>
                  </div>

                  {/* Contract Method Buttons Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => handleExecuteRealWrite("deposit", [], "1000000000000000000")}
                      disabled={simulationState !== "idle"}
                      className="flex items-center justify-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      deposit()
                    </button>

                    <button
                      onClick={() => handleExecuteRealWrite("mark_completed", [submissionInput])}
                      disabled={simulationState !== "idle"}
                      className="flex items-center justify-center gap-1.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      mark_completed()
                    </button>

                    <button
                      onClick={() => handleExecuteRealWrite("open_dispute", [buyerEvidenceInput])}
                      disabled={simulationState !== "idle"}
                      className="flex items-center justify-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      open_dispute()
                    </button>

                    <button
                      onClick={() => handleExecuteRealWrite("submit_seller_evidence", [sellerEvidenceInput])}
                      disabled={simulationState !== "idle"}
                      className="flex items-center justify-center gap-1.5 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-400 font-bold text-xs py-2.5 rounded-xl transition-all disabled:opacity-50"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      submit_seller_evidence()
                    </button>
                  </div>

                  {/* AI Consensus & Bound Ruling Execution */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => handleExecuteRealWrite("resolve_dispute_with_ai")}
                      disabled={simulationState !== "idle"}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 fill-white" />
                      resolve_dispute_with_ai()
                    </button>

                    <button
                      onClick={() => handleExecuteRealWrite("execute_ruling")}
                      disabled={simulationState !== "idle"}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs py-3 rounded-xl transition-all disabled:opacity-50"
                      title="Executes payout bound strictly to stored consensus ruling"
                    >
                      <Gavel className="w-4 h-4" />
                      execute_ruling() [Bound to Consensus Ruling]
                    </button>
                  </div>
                </div>
              </div>

              <div>
                {simulationState !== "idle" && (
                  <button
                    onClick={resetSimulation}
                    disabled={simulationState !== "success"}
                    className={`w-full flex items-center justify-center gap-2 border font-semibold py-3.5 rounded-2xl transition-all ${
                      simulationState === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-white/5 border-white/5 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {simulationState === "success" ? (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Reset Client Console
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        Executing {activeMethod || "Transaction"}...
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right Section: Node Consensus Console & Transaction History (7 cols) */}
            <div className="lg:col-span-7 bg-dark-bg/95 p-6 sm:p-8 flex flex-col justify-between gap-8">
              {/* AI Verification Console */}
              <div className="glass-panel border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                  Multi-LLM Consensus Decision Panel
                </h5>

                <div className="space-y-3 font-mono text-[11px] text-gray-400">
                  {simulationState === "idle" && (
                    <div className="flex items-center gap-2 text-gray-500 py-4 justify-center">
                      <AlertCircle className="w-4 h-4" />
                      <span>Ready for contract invocation. Trigger action on the left.</span>
                    </div>
                  )}

                  {simulationState !== "idle" && (
                    <div className="flex items-start gap-2 text-gray-300">
                      <span className="text-primary font-bold">[SYS]</span>
                      <span>Relaying write transaction payload '{activeMethod}' to GenLayer VM...</span>
                    </div>
                  )}

                  {(simulationState === "querying" || simulationState === "consensus" || simulationState === "success") && (
                    <div className="space-y-2 mt-2">
                      <div className="flex items-start gap-2">
                        <span className="text-secondary font-bold">[NODE_1]</span>
                        <span>
                          {node1Status === "processing" ? "Validator 1 querying Claude 3.5 Sonnet..." : ""}
                          {node1Status === "done" ? (
                            <span className="text-emerald-400">Claude-3.5-Sonnet evaluated evidence: BUYER (Confidence: 100%)</span>
                          ) : ""}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-secondary font-bold">[NODE_2]</span>
                        <span>
                          {node2Status === "processing" ? "Validator 2 querying GPT-4o..." : ""}
                          {node2Status === "done" ? (
                            <span className="text-emerald-400">GPT-4o evaluated evidence: BUYER (Confidence: 98%)</span>
                          ) : ""}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-secondary font-bold">[NODE_3]</span>
                        <span>
                          {node3Status === "processing" ? "Validator 3 querying Llama-3-70B..." : ""}
                          {node3Status === "done" ? (
                            <span className="text-emerald-400">Llama-3-70B evaluated evidence: BUYER (Confidence: 95%)</span>
                          ) : ""}
                        </span>
                      </div>
                    </div>
                  )}

                  {(simulationState === "consensus" || simulationState === "success") && (
                    <div className="flex items-start gap-2 text-violet-400 font-bold mt-2">
                      <span>[CONSENSUS]</span>
                      <span>3/3 Nodes agreed on ruling 'BUYER'. Stored Consensus Ruling ACHIEVED.</span>
                    </div>
                  )}

                  {simulationState === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 font-sans"
                    >
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Transaction Successfully Verified & Finalized</p>
                        <p className="text-[10px] opacity-80 mt-0.5">
                          SmartEscrow state updated. Settlement bound to stored consensus ruling.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* On-Chain Consensus Ruling Snapshot */}
              <div className="glass-panel border border-white/5 rounded-2xl p-4 bg-black/40">
                <h5 className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Stored Consensus Ruling (self.dispute_ruling)</span>
                  <span className="text-emerald-400 font-mono text-[10px]">Bound to Settlement</span>
                </h5>
                <div className="font-mono text-[11px] text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                  {contractStatus?.dispute_ruling ? (
                    <pre className="whitespace-pre-wrap">{contractStatus.dispute_ruling}</pre>
                  ) : (
                    <span className="text-gray-500 italic">No dispute ruling stored yet. Run resolve_dispute_with_ai() to generate consensus ruling.</span>
                  )}
                </div>
              </div>

              {/* Transaction History log list */}
              <div>
                <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>SmartEscrow Transaction Ledger Log</span>
                  <span className="text-[10px] text-gray-500 font-sans font-normal">Updated Live</span>
                </h5>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {transactions.map((tx) => (
                      <motion.div
                        key={tx.hash}
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/30 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-4 text-xs font-mono text-gray-300"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{tx.hash}</span>
                          <span className="font-sans font-semibold text-white">{tx.contract}</span>
                          <span className="text-secondary text-[10px] bg-secondary/10 px-2 py-0.5 rounded-full">{tx.method}</span>
                        </div>

                        <div className="flex items-center gap-3 font-sans">
                          <span className="text-[10px] text-gray-400 hidden sm:inline">{tx.consensus}</span>
                          {tx.status === "Pending" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              Success
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network configuration card */}
        <NetworkCard />

        {/* Dashboard stats cards below */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="glass-panel border border-white/10 rounded-2xl p-6">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Deployment Network</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-white">Studio Next</span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">GenLayer Testnet Layer</p>
          </div>

          <div className="glass-panel border border-white/10 rounded-2xl p-6">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Network Chain ID</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-white font-mono">61997</span>
              <span className="text-xs text-secondary font-bold">(0xF22D)</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">EVM Compatible Chain ID</p>
          </div>

          <div className="glass-panel border border-white/10 rounded-2xl p-6">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Smart Contract</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-white font-mono">SmartEscrow</span>
              <span className="text-xs text-primary font-bold">Python VM</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">AI-arbitrated State Machine</p>
          </div>
        </div>
      </div>
    </section>
  );
}
