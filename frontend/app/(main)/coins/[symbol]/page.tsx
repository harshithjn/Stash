"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Globe,
  ExternalLink,
  Star,
  BarChart3,
  DollarSign,
  Activity,
} from "lucide-react";

interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    atl_date: { usd: string };
  };
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    twitter_screen_name: string;
  };
  market_cap_rank: number;
}

export default function CoinDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;

  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<"1" | "7" | "30" | "365">("7");

  useEffect(() => {
    if (symbol) {
      fetchCoinDetails();
      fetchChartData();
    }
  }, [symbol, chartPeriod]);

  const fetchCoinDetails = async () => {
    try {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${symbol}?localization=false&tickers=false&community_data=false&developer_data=false`
      );
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }
        throw new Error("Failed to fetch coin details");
      }
      
      const data = await res.json();
      setCoin(data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching coin details:", err);
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=${chartPeriod}`
      );
      
      if (!res.ok) {
        if (res.status === 429) {
          console.warn("Rate limit for chart data");
          return;
        }
        throw new Error("Failed to fetch chart data");
      }
      
      const data = await res.json();
      setChartData(data);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (!value) return "N/A";
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  const formatNumber = (value: number) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-US").format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading coin details...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Coin not found</p>
          <Link href="/coins" className="text-blue-500 hover:underline">
            Back to Coins
          </Link>
        </div>
      </div>
    );
  }

  const priceChange24h = coin.market_data.price_change_percentage_24h;
  const isPositive = priceChange24h >= 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Back Button */}
        <Link
          href="/coins"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Coins
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={coin.image.large}
              alt={coin.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold">{coin.name}</h1>
                <span className="text-xl text-gray-400 uppercase">{coin.symbol}</span>
                <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
                  Rank #{coin.market_cap_rank}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-3xl font-semibold">
                  {formatCurrency(coin.market_data.current_price.usd)}
                </div>
                <div
                  className={`flex items-center gap-1 text-lg ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  {Math.abs(priceChange24h).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-2">
            {coin.links.homepage[0] && (
              <a
                href={coin.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#111] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <Globe size={18} />
              </a>
            )}
            {coin.links.twitter_screen_name && (
              <a
                href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#111] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <DollarSign size={16} className="text-blue-500" />
              Market Cap
            </div>
            <div className="text-2xl font-semibold">
              {formatLargeNumber(coin.market_data.market_cap.usd)}
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Activity size={16} className="text-purple-500" />
              24h Volume
            </div>
            <div className="text-2xl font-semibold">
              {formatLargeNumber(coin.market_data.total_volume.usd)}
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <TrendingUp size={16} className="text-green-500" />
              24h High
            </div>
            <div className="text-2xl font-semibold">
              {formatCurrency(coin.market_data.high_24h.usd)}
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-lg p-5">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <TrendingDown size={16} className="text-red-500" />
              24h Low
            </div>
            <div className="text-2xl font-semibold">
              {formatCurrency(coin.market_data.low_24h.usd)}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Price Chart</h2>
            <div className="flex gap-2">
              {["1", "7", "30", "365"].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    chartPeriod === period
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {period === "1" ? "24H" : period === "7" ? "7D" : period === "30" ? "30D" : "1Y"}
                </button>
              ))}
            </div>
          </div>

          {chartData && chartData.prices ? (
            <div className="h-80 relative">
              <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {(() => {
                  const prices = chartData.prices.map((p: any) => p[1]);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  const priceRange = maxPrice - minPrice;
                  
                  const points = chartData.prices.map((point: any, i: number) => {
                    const x = (i / (chartData.prices.length - 1)) * 800;
                    const y = 320 - ((point[1] - minPrice) / priceRange) * 300;
                    return `${x},${y}`;
                  }).join(" ");

                  const areaPoints = `0,320 ${points} 800,320`;

                  return (
                    <>
                      <polyline
                        points={areaPoints}
                        fill="url(#priceGradient)"
                      />
                      <polyline
                        points={points}
                        fill="none"
                        stroke={isPositive ? "#10b981" : "#ef4444"}
                        strokeWidth="2"
                      />
                    </>
                  );
                })()}
              </svg>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Stats */}
          <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Market Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Circulating Supply</span>
                <span className="font-medium">
                  {formatNumber(coin.market_data.circulating_supply)} {coin.symbol.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Supply</span>
                <span className="font-medium">
                  {formatNumber(coin.market_data.total_supply)} {coin.symbol.toUpperCase()}
                </span>
              </div>
              {coin.market_data.max_supply && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Supply</span>
                  <span className="font-medium">
                    {formatNumber(coin.market_data.max_supply)} {coin.symbol.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t border-gray-800">
                <span className="text-gray-400">All-Time High</span>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(coin.market_data.ath.usd)}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(coin.market_data.ath_date.usd).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">All-Time Low</span>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(coin.market_data.atl.usd)}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(coin.market_data.atl_date.usd).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Changes */}
          <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Price Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">24 Hours</span>
                <span
                  className={`font-medium ${
                    coin.market_data.price_change_percentage_24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.market_data.price_change_percentage_24h >= 0 ? "+" : ""}
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">7 Days</span>
                <span
                  className={`font-medium ${
                    coin.market_data.price_change_percentage_7d >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.market_data.price_change_percentage_7d >= 0 ? "+" : ""}
                  {coin.market_data.price_change_percentage_7d.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">30 Days</span>
                <span
                  className={`font-medium ${
                    coin.market_data.price_change_percentage_30d >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.market_data.price_change_percentage_30d >= 0 ? "+" : ""}
                  {coin.market_data.price_change_percentage_30d.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {coin.description.en && (
          <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About {coin.name}</h2>
            <div
              className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.split(". ").slice(0, 3).join(". ") + ".",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
