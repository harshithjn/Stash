"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../lib/supabase/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Sparkles,
  ExternalLink,
  Search,
} from "lucide-react";

interface MarketData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const userId = params.id as string;

  const [portfolioValue, setPortfolioValue] = useState<number>(0);
  const [roi, setROI] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [topGainers, setTopGainers] = useState<MarketData[]>([]);
  const [topLosers, setTopLosers] = useState<MarketData[]>([]);
  const [marketCap, setMarketCap] = useState<number>(0);
  const [volume24h, setVolume24h] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("top");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allCoins, setAllCoins] = useState<MarketData[]>([]);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser || currentUser.id !== userId) {
        router.push("/login");
        return;
      }
      
      const { data: portfolio } = await supabase
        .from("portfolios")
        .select("total_value_usd, roi_percentage, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (portfolio) {
        setPortfolioValue(Number(portfolio.total_value_usd) || 0);
        setROI(Number(portfolio.roi_percentage) || 0);
      }

      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      const data: MarketData[] = await res.json();

      const totalMarketCap = data.reduce((sum, coin) => sum + coin.market_cap, 0);
      const totalVolume = data.reduce((sum, coin) => sum + coin.total_volume, 0);
      setMarketCap(totalMarketCap);
      setVolume24h(totalVolume);

      const sorted = [...data].sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );
      setTopGainers(sorted.slice(0, 5));
      setTopLosers(sorted.slice(-5).reverse());
      setAllCoins(data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  const getFilteredCoins = () => {
    let filtered = [...allCoins];

    if (searchQuery) {
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeTab) {
      case "top":
        return filtered.slice(0, 10);
      case "trending":
        return filtered.sort((a, b) => b.total_volume - a.total_volume).slice(0, 10);
      case "gainers":
        return filtered
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
          .slice(0, 10);
      case "decliner":
        return filtered
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
          .slice(0, 10);
      case "new-launch":
        return filtered.slice(20, 30);
      case "most-visited":
        return filtered.slice(0, 10);
      default:
        return filtered.slice(0, 10);
    }
  };

  const displayCoins = getFilteredCoins();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Trending Projects</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#111] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 w-64"
              />
            </div>
            <Link href="/market" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {loading ? (
            <div className="col-span-5 text-center py-12 text-gray-500">Loading...</div>
          ) : (
            topGainers.slice(0, 5).map((coin) => (
              <Link
                key={coin.id}
                href={`/coins/${coin.symbol}`}
                className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-gray-800 rounded-xl p-4 hover:border-purple-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={14} className="text-gray-500" />
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">Proof of Stake</div>
                    <div className="font-semibold text-sm truncate">{coin.name}</div>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="text-xs text-gray-500">Token Price</div>
                  <div className="text-xl font-bold">${coin.current_price.toLocaleString()}</div>
                </div>

                <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                  coin.price_change_percentage_24h >= 0 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </div>

                <div className="mt-3 h-12 flex items-end gap-0.5">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${
                        coin.price_change_percentage_24h >= 0 
                          ? 'bg-green-500/20' 
                          : 'bg-red-500/20'
                      }`}
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="flex items-center gap-2 border-b border-gray-800 mb-6">
          {["top", "trending", "gainers", "decliner", "new-launch", "most-visited"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {tab === "new-launch" ? "New-Launch" : tab === "most-visited" ? "Most Visited" : tab}
            </button>
          ))}
          <div className="ml-auto">
            <Link href="/market" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">1h%</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">24h%</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">7d%</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Last 24h</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">Loading market data...</td>
                  </tr>
                ) : displayCoins.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">No coins found</td>
                  </tr>
                ) : (
                  displayCoins.map((coin, idx) => (
                    <tr
                      key={coin.id}
                      className="hover:bg-gray-900/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/coins/${coin.symbol}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-gray-600 hover:text-purple-500 cursor-pointer" />
                          <span className="text-sm text-gray-500">{String(idx + 1).padStart(2, '0')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                          <div>
                            <div className="font-medium text-sm">{coin.name}</div>
                            <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-medium">
                          ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm ${Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                          {Math.random() > 0.5 ? '+' : ''}{(Math.random() * 10 - 5).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm ${Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'}`}>
                          {Math.random() > 0.5 ? '+' : ''}{(Math.random() * 20 - 10).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm">{formatLargeNumber(coin.market_cap)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm">{formatLargeNumber(coin.total_volume)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="w-24 h-8 flex items-end gap-0.5 ml-auto">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t ${
                                coin.price_change_percentage_24h >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'
                              }`}
                              style={{ height: `${Math.random() * 100}%` }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1 bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-pink-600/10 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-purple-400" />
              <h3 className="text-sm font-medium text-gray-300">Stash</h3>
            </div>
            
            <h2 className="text-xl font-bold mb-2">Elevating Your Entire Web3 Journey</h2>
            <p className="text-sm text-gray-400 mb-6">
              Elevate your Web3 journey with seamless, secure, and comprehensive crypto APIs, powered by Stash.
            </p>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <DollarSign size={16} />
                Connect with Wallet
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Activity size={16} />
                Enter a Wallet Address
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Portfolio Value</span>
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <DollarSign size={18} className="text-purple-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{formatCurrency(portfolioValue)}</div>
              <div className="flex items-center gap-2">
                {roi >= 0 ? (
                  <>
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <ArrowUpRight size={16} />
                      <span>+{roi.toFixed(2)}%</span>
                    </div>
                    <span className="text-xs text-gray-500">vs. initial investment</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <ArrowDownRight size={16} />
                      <span>{roi.toFixed(2)}%</span>
                    </div>
                    <span className="text-xs text-gray-500">vs. initial investment</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Total Market Cap</span>
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <BarChart3 size={18} className="text-purple-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{formatLargeNumber(marketCap)}</div>
              <div className="text-xs text-gray-500">Global cryptocurrency market</div>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">24h Trading Volume</span>
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Activity size={18} className="text-orange-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{formatLargeNumber(volume24h)}</div>
              <div className="text-xs text-gray-500">Total trading volume</div>
            </div>

            <Link
              href={`/portfolio/${userId}`}
              className="bg-gradient-to-br from-purple-600 to-purple-700 border border-purple-500/20 rounded-xl p-6 hover:from-purple-500 hover:to-purple-600 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-purple-100">Portfolio Management</span>
                <ArrowUpRight size={18} className="text-purple-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">View Details</div>
              <div className="text-xs text-purple-200">Track and manage your crypto assets</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
