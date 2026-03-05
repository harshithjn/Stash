"use client";

import Link from "next/link";

export default function AssetListPage() {
  // 🧩 Demo assets (you can expand this list anytime)
  const demoAssets = [
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      price: 67423,
      change: 2.4,
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      price: 3520,
      change: -1.1,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    },
    {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      price: 156,
      change: 3.2,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    },
    {
      id: "cardano",
      symbol: "ADA",
      name: "Cardano",
      price: 0.52,
      change: 0.8,
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    },
  ];

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Popular Crypto Assets</h1>
      <p className="text-gray-400 mb-8">Click an asset to view detailed information.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {demoAssets.map((asset) => (
          <Link
            key={asset.id}
            href={`/asset/${asset.id}`} // ✅ This links to the dynamic asset route
            className="bg-[#0b0b0b] border border-gray-800 rounded-xl p-5 hover:bg-gray-900 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={asset.image}
                alt={asset.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-lg">{asset.name}</h2>
                <p className="text-gray-400 text-sm">{asset.symbol}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold">${asset.price.toLocaleString()}</p>
              <p
                className={`text-sm font-medium ${
                  asset.change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {asset.change >= 0 ? "+" : ""}
                {asset.change}%
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
