"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Users, Github, TrendingUp, Bell, BarChart3, Wallet, Lock, Check } from "lucide-react";

const contributors = [
  { name: "Jeevitha S", github: "https://github.com/jeevitha-14s", avatar: "https://github.com/jeevitha-14s.png" },
  { name: "Harshith JN", github: "https://github.com/harshithjn", avatar: "https://github.com/harshithjn.png" },
  { name: "Kartik Sumbly", github: "https://github.com/KARTIKSUMBLY", avatar: "https://github.com/KARTIKSUMBLY.png" },
  { name: "Hema Shree", github: "https://github.com/HemaShree0408", avatar: "https://github.com/HemaShree0408.png" },
];

const coins = [
  { name: "Bitcoin", symbol: "BTC", logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { name: "Ethereum", symbol: "ETH", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { name: "Cardano", symbol: "ADA", logo: "https://assets.coingecko.com/coins/images/975/small/cardano.png" },
  { name: "Solana", symbol: "SOL", logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
  { name: "Polkadot", symbol: "DOT", logo: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png" },
  { name: "Avalanche", symbol: "AVAX", logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png" },
  { name: "Polygon", symbol: "MATIC", logo: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png" },
  { name: "Chainlink", symbol: "LINK", logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
  { name: "Ripple", symbol: "XRP", logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" },
  { name: "Litecoin", symbol: "LTC", logo: "https://assets.coingecko.com/coins/images/2/small/litecoin.png" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showContributors, setShowContributors] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Clear any old localStorage auth tokens
    if (typeof window !== 'undefined') {
      const keys = Object.keys(window.localStorage);
      keys.forEach(key => {
        if (key.includes('sb-') && key.includes('-auth-token')) {
          window.localStorage.removeItem(key);
        }
      });
    }
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
                alt="Stash Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">Stash</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onMouseEnter={() => setShowContributors(true)}
                  onMouseLeave={() => setShowContributors(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors border border-gray-800 rounded-lg hover:border-purple-500/50"
                >
                  <Users size={16} />
                  Contributors
                </button>
                
                {showContributors && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-64 bg-[#111] border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={() => setShowContributors(true)}
                    onMouseLeave={() => setShowContributors(false)}
                  >
                    <div className="p-3 border-b border-gray-800">
                      <h3 className="text-sm font-semibold text-gray-300">Project Contributors</h3>
                    </div>
                    <div className="p-2">
                      {contributors.map((contributor) => (
                        <a
                          key={contributor.github}
                          href={contributor.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-500/10 transition-colors group"
                        >
                          <img
                            src={contributor.avatar}
                            alt={contributor.name}
                            className="w-10 h-10 rounded-full border-2 border-gray-800 group-hover:border-purple-500 transition-colors"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">{contributor.name}</div>
                            <div className="text-xs text-gray-500">@{contributor.github.split('/').pop()}</div>
                          </div>
                          <Github size={16} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6 animate-in fade-in slide-in-from-left duration-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-sm text-purple-300">Real-Time Crypto Tracking</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Track Your
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  Digital Assets
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                A personal investment tracking application for cryptocurrencies and digital assets, featuring real-time price monitoring, portfolio performance analysis, and investment recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg font-semibold transition-all flex items-center gap-2 group shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transform"
                >
                  Get Started Free
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-gray-800 hover:border-purple-500/50 rounded-lg font-semibold transition-all"
                >
                  View Demo
                </Link>
              </div>
            </div>

            {/* Right Content - Laptop Mockup */}
            <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-300">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl animate-pulse" />
                
                {/* Laptop Frame */}
                <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl p-3 border-t border-x border-gray-700 shadow-2xl">
                  {/* Screen */}
                  <div className="bg-[#0a0a0a] rounded-lg overflow-hidden border border-gray-800">
                    {/* Browser Bar */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-gray-800">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1 text-center">
                        <div className="inline-block px-4 py-1 bg-gray-800 rounded text-xs text-gray-400">
                          stash.app/dashboard
                        </div>
                      </div>
                    </div>
                    
                    {/* Dashboard Content */}
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4 animate-in fade-in duration-500 delay-500">
                          <div className="text-xs text-gray-400 mb-2">Total Balance</div>
                          <div className="text-xl font-bold">$12,345</div>
                          <div className="text-xs text-green-500 mt-1">+12.5%</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4 animate-in fade-in duration-500 delay-700">
                          <div className="text-xs text-gray-400 mb-2">24h Change</div>
                          <div className="text-xl font-bold">+$234</div>
                          <div className="text-xs text-green-500 mt-1">+1.9%</div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border border-pink-500/30 rounded-xl p-4 animate-in fade-in duration-500 delay-900">
                          <div className="text-xs text-gray-400 mb-2">Assets</div>
                          <div className="text-xl font-bold">8</div>
                          <div className="text-xs text-gray-500 mt-1">Coins</div>
                        </div>
                      </div>
                      
                      {/* Chart */}
                      <div className="h-32 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl flex items-end gap-1 p-4 animate-in fade-in duration-500 delay-1000">
                        {[40, 60, 45, 70, 55, 80, 65, 85, 75, 90, 80, 95].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t animate-in slide-in-from-bottom duration-500"
                            style={{ 
                              height: `${height}%`,
                              animationDelay: `${1200 + i * 50}ms`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Laptop Base */}
                <div className="h-2 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-xl" />
                <div className="h-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-2xl mx-auto w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coin Marquee */}
      <section className="py-12 border-y border-gray-800 overflow-hidden">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Multi-Coin Support</h2>
          <p className="text-gray-400">Track 100+ cryptocurrencies in real-time</p>
        </div>
        
        {/* Marquee Container */}
        <div className="relative">
          <div className="flex animate-marquee">
            {[...coins, ...coins].map((coin, index) => (
              <div
                key={`${coin.symbol}-${index}`}
                className="flex items-center gap-3 mx-6 whitespace-nowrap"
              >
                <img src={coin.logo} alt={coin.name} className="w-8 h-8" />
                <div>
                  <div className="text-sm font-semibold">{coin.name}</div>
                  <div className="text-xs text-gray-500">{coin.symbol}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Box Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Top Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your crypto portfolio like a pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large Feature - Real-Time Tracking */}
            <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-purple-600/10 to-purple-900/10 border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp size={24} className="text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Real-Time Portfolio Tracking</h3>
                <p className="text-gray-400 mb-6">
                  Monitor your investments with live price updates, detailed analytics, and performance metrics across all your holdings.
                </p>
                <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Value</span>
                    <span className="text-lg font-bold text-green-500">+12.5%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-3/4 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[65, 45, 80].map((h, i) => (
                      <div key={i} className="h-16 bg-gradient-to-t from-purple-500/50 to-transparent rounded" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Alerts */}
            <div className="bg-gradient-to-br from-blue-600/10 to-blue-900/10 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Bell size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Alerts</h3>
              <p className="text-sm text-gray-400 mb-4">
                Get notified when prices hit your targets
              </p>
              <div className="space-y-2">
                {[
                  { coin: "BTC", price: "$50,000", status: "active" },
                  { coin: "ETH", price: "$3,000", status: "triggered" },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
                    <span className="text-sm font-medium">{alert.coin}</span>
                    <span className="text-xs text-gray-500">{alert.price}</span>
                    <div className={`w-2 h-2 rounded-full ${alert.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Analytics */}
            <div className="bg-gradient-to-br from-green-600/10 to-green-900/10 border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all group">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
              <p className="text-sm text-gray-400 mb-4">
                Deep insights with charts and metrics
              </p>
              <div className="h-24 flex items-end gap-1">
                {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-green-500 to-green-600 rounded-t transition-all hover:from-green-400 hover:to-green-500"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Multi-Wallet */}
            <div className="lg:col-span-2 bg-gradient-to-br from-orange-600/10 to-orange-900/10 border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/40 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Wallet size={24} className="text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Multi-Wallet Support</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Manage multiple wallets and portfolios from a single dashboard
                  </p>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-16 h-20 bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg p-2">
                      <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-transparent rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-gradient-to-br from-red-600/10 to-red-900/10 border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all group">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                <Lock size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank-Grade Security</h3>
              <p className="text-sm text-gray-400 mb-4">
                Your data is encrypted and secured
              </p>
              <div className="space-y-2">
                {["End-to-end encryption", "2FA enabled", "Non-custodial"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-red-500/20 rounded-full flex items-center justify-center">
                      <Check size={10} className="text-red-400" />
                    </div>
                    <span className="text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Everything you need to know about Stash</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is Stash free to use?",
                a: "Yes! Stash is completely free to use. You can track unlimited cryptocurrencies and create multiple portfolios without any cost."
              },
              {
                q: "How do you get real-time price data?",
                a: "We integrate with CoinGecko API to provide accurate, real-time cryptocurrency prices and market data for over 100+ coins."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use bank-grade encryption and never store your private keys. Your portfolio data is encrypted and only accessible by you."
              },
              {
                q: "Can I track multiple portfolios?",
                a: "Yes! You can create and manage multiple portfolios, perfect for separating different investment strategies or tracking various wallets."
              },
              {
                q: "Do you support mobile devices?",
                a: "Yes, Stash is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktops."
              },
              {
                q: "How do price alerts work?",
                a: "Set custom price targets for any cryptocurrency. When the price reaches your target, you'll receive an instant notification in your dashboard."
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-lg">{faq.q}</span>
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center group-open:rotate-180 transition-transform">
                    <ArrowRight size={16} className="text-purple-400 rotate-90" />
                  </div>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-in fade-in slide-in-from-bottom duration-700">
            Ready to Start Tracking?
          </h2>
          <p className="text-xl text-gray-400 mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Join thousands managing their crypto portfolios with Stash
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg font-semibold transition-all group shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transform animate-in fade-in slide-in-from-bottom duration-700 delay-300"
          >
            Get Started Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-from-left {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-from-right {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-from-bottom {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-from-top-2 {
          from {
            transform: translateY(-8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation-name: fade-in;
        }

        .slide-in-from-left {
          animation-name: slide-in-from-left;
        }

        .slide-in-from-right {
          animation-name: slide-in-from-right;
        }

        .slide-in-from-bottom {
          animation-name: slide-in-from-bottom;
        }

        .slide-in-from-top-2 {
          animation-name: slide-in-from-top-2;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-900 {
          animation-delay: 900ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
