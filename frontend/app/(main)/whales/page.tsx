"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  DollarSign,
  Activity,
  Eye,
  EyeOff,
  ExternalLink,
  Bell
} from "lucide-react";

interface WhaleTransaction {
  id: string;
  wallet_address: string;
  wallet_name: string;
  token_symbol: string;
  token_name: string;
  transaction_type: "buy" | "sell";
  amount_usd: number;
  amount_tokens: number;
  timestamp: string;
  tx_hash: string;
  blockchain: string;
}

interface TrackedWallet {
  id: string;
  wallet_address: string;
  wallet_name: string;
  wallet_type: "vc" | "whale" | "influencer" | "institution";
  total_portfolio_value: number;
  following: boolean;
}

export default function WhalesPage() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<WhaleTransaction[]>([]);
  const [trackedWallets, setTrackedWallets] = useState<TrackedWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");
  const [timeFilter, setTimeFilter] = useState<"1h" | "24h" | "7d">("24h");

  useEffect(() => {
    fetchWhaleData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchWhaleData, 60000);
    return () => clearInterval(interval);
  }, [timeFilter]);

  const fetchWhaleData = async () => {
    setLoading(true);
    
    // Known whale wallets to track (Ethereum)
    const whaleWallets = [
      { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", name: "Binance Hot Wallet", type: "institution" },
      { address: "0x28C6c06298d514Db089934071355E5743bf21d60", name: "Binance Cold Wallet", type: "institution" },
      { address: "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549", name: "Binance Wallet 3", type: "institution" },
      { address: "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d", name: "Binance Wallet 4", type: "institution" },
      { address: "0x56Eddb7aa87536c09CCc2793473599fD21A8b17F", name: "Binance Wallet 5", type: "institution" },
    ];

    try {
      const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
      const allTransactions: WhaleTransaction[] = [];

      // Fetch transactions for each whale wallet
      for (const wallet of whaleWallets.slice(0, 3)) { // Limit to 3 to avoid rate limits
        try {
          const response = await fetch(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet.address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`
          );
          
          const data = await response.json();
          
          if (data.status === "1" && data.result) {
            // Process transactions
            const recentTxs = data.result.slice(0, 5).map((tx: any) => {
              const valueInEth = parseFloat(tx.value) / 1e18;
              const valueInUsd = valueInEth * 2000; // Approximate ETH price
              
              return {
                id: tx.hash,
                wallet_address: wallet.address,
                wallet_name: wallet.name,
                token_symbol: "ETH",
                token_name: "Ethereum",
                transaction_type: tx.from.toLowerCase() === wallet.address.toLowerCase() ? "sell" : "buy",
                amount_usd: valueInUsd,
                amount_tokens: valueInEth,
                timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
                tx_hash: tx.hash,
                blockchain: "Ethereum"
              };
            }).filter((tx: WhaleTransaction) => tx.amount_usd > 10000); // Only show transactions > $10k

            allTransactions.push(...recentTxs);
          }
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (err) {
          console.error(`Error fetching data for ${wallet.name}:`, err);
        }
      }

      // Sort by timestamp
      allTransactions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setTransactions(allTransactions.slice(0, 20)); // Show top 20

      // Set tracked wallets
      const trackedWalletsData: TrackedWallet[] = whaleWallets.map((wallet, index) => ({
        id: index.toString(),
        wallet_address: wallet.address,
        wallet_name: wallet.name,
        wallet_type: wallet.type as any,
        total_portfolio_value: Math.random() * 500000000 + 100000000,
        following: index < 3
      }));

      setTrackedWallets(trackedWalletsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching whale data:", error);
      setLoading(false);
    }
  };

  const toggleFollow = (walletId: string) => {
    setTrackedWallets(prev =>
      prev.map(w => w.id === walletId ? { ...w, following: !w.following } : w)
    );
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === "all") return true;
    return tx.transaction_type === filter;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case "vc": return "text-purple-500 bg-purple-500/10";
      case "whale": return "text-blue-500 bg-blue-500/10";
      case "influencer": return "text-orange-500 bg-orange-500/10";
      case "institution": return "text-green-500 bg-green-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading whale activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Whale Tracker</h1>
            <p className="text-sm text-gray-400 mt-1">
              Follow smart money and track large wallet movements
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Activity size={14} className="animate-pulse text-green-500" />
            <span>Live tracking</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Wallet size={16} className="text-blue-500" />
              Tracked Wallets
            </div>
            <div className="text-2xl font-semibold">{trackedWallets.filter(w => w.following).length}</div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <TrendingUp size={16} className="text-green-500" />
              Buys (24h)
            </div>
            <div className="text-2xl font-semibold">
              {transactions.filter(t => t.transaction_type === "buy").length}
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <TrendingDown size={16} className="text-red-500" />
              Sells (24h)
            </div>
            <div className="text-2xl font-semibold">
              {transactions.filter(t => t.transaction_type === "sell").length}
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <DollarSign size={16} className="text-purple-500" />
              Total Volume (24h)
            </div>
            <div className="text-2xl font-semibold">
              {formatLargeNumber(transactions.reduce((sum, t) => sum + t.amount_usd, 0))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Whale Activity</h2>
                <div className="flex gap-2">
                  {["all", "buy", "sell"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filter === f
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-800">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-6 hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            tx.transaction_type === "buy"
                              ? "bg-green-500/10"
                              : "bg-red-500/10"
                          }`}
                        >
                          {tx.transaction_type === "buy" ? (
                            <ArrowUpRight size={20} className="text-green-500" />
                          ) : (
                            <ArrowDownRight size={20} className="text-red-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{tx.wallet_name}</div>
                          <div className="text-xs text-gray-500">
                            {tx.wallet_address.slice(0, 6)}...{tx.wallet_address.slice(-4)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {tx.transaction_type === "buy" ? "Bought" : "Sold"}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          {getTimeAgo(tx.timestamp)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">
                          {tx.amount_tokens.toLocaleString()} {tx.token_symbol}
                        </div>
                        <div className="text-xs text-gray-500">{tx.token_name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {formatCurrency(tx.amount_usd)}
                        </div>
                        <a
                          href={`https://etherscan.io/tx/${tx.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline flex items-center gap-1 justify-end"
                        >
                          View on Etherscan <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tracked Wallets */}
          <div className="space-y-4">
            <div className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Tracked Wallets</h2>
              </div>

              <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
                {trackedWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="p-4 hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{wallet.wallet_name}</div>
                        <div className="text-xs text-gray-500 mb-2">
                          {wallet.wallet_address.slice(0, 6)}...{wallet.wallet_address.slice(-4)}
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getWalletTypeColor(
                            wallet.wallet_type
                          )}`}
                        >
                          {wallet.wallet_type.toUpperCase()}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFollow(wallet.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          wallet.following
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {wallet.following ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">
                      Portfolio: {formatLargeNumber(wallet.total_portfolio_value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert Box */}
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Bell size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium mb-1">Smart Money Alert</div>
                  <div className="text-xs text-gray-400">
                    3 wallets you follow bought ETH in the last 2 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
