"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface StashAIProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StashAI({ isOpen, onClose }: StashAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Stash AI, your crypto investment assistant. I can help you with market analysis, investment recommendations, portfolio strategies, and answer your crypto questions. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();

    // Investment recommendations based on keywords
    if (lowerMessage.includes("recommend") || lowerMessage.includes("should i buy") || lowerMessage.includes("invest")) {
      return `Based on current market analysis:

📈 **Top Recommendations:**
1. **Bitcoin (BTC)** - Strong institutional adoption, consider for 40% allocation
2. **Ethereum (ETH)** - Solid fundamentals with upcoming upgrades, 30% allocation
3. **Solana (SOL)** - High growth potential, 15% allocation
4. **Stablecoins (USDC/USDT)** - For liquidity and risk management, 15% allocation

⚠️ **Risk Management:**
- Diversify across multiple assets
- Only invest what you can afford to lose
- Consider dollar-cost averaging (DCA)
- Set stop-loss orders for volatile positions

Remember: This is not financial advice. Always do your own research.`;
    }

    if (lowerMessage.includes("bitcoin") || lowerMessage.includes("btc")) {
      return `**Bitcoin (BTC) Analysis:**

📊 **Current Outlook:** Bullish
- Strong institutional demand continues
- Limited supply (21M cap) creates scarcity
- Halving events historically drive price appreciation
- Growing adoption as "digital gold"

💡 **Investment Strategy:**
- Best for long-term holding (1-5 years)
- Consider DCA to reduce volatility impact
- Ideal as portfolio foundation (30-50% allocation)

⚠️ **Risks:** Regulatory uncertainty, high volatility, energy consumption concerns`;
    }

    if (lowerMessage.includes("ethereum") || lowerMessage.includes("eth")) {
      return `**Ethereum (ETH) Analysis:**

📊 **Current Outlook:** Very Bullish
- Leading smart contract platform
- Successful transition to Proof-of-Stake
- Strong DeFi and NFT ecosystem
- Upcoming scaling improvements (sharding)

💡 **Investment Strategy:**
- Excellent for medium to long-term (2-5 years)
- Benefits from network growth and adoption
- Consider 25-40% portfolio allocation

⚠️ **Risks:** Competition from other L1s, gas fees, technical complexity`;
    }

    if (lowerMessage.includes("portfolio") || lowerMessage.includes("diversify")) {
      return `**Portfolio Diversification Strategy:**

🎯 **Conservative Portfolio (Low Risk):**
- 50% Bitcoin
- 30% Ethereum
- 15% Stablecoins
- 5% Top 10 altcoins

⚡ **Balanced Portfolio (Medium Risk):**
- 40% Bitcoin
- 30% Ethereum
- 20% Top altcoins (SOL, ADA, MATIC)
- 10% Stablecoins

🚀 **Aggressive Portfolio (High Risk):**
- 30% Bitcoin
- 25% Ethereum
- 35% High-growth altcoins
- 10% Emerging projects

💡 **Key Principles:**
- Rebalance quarterly
- Take profits on 20%+ gains
- Keep emergency fund in stablecoins
- Never invest more than 5-10% of net worth in crypto`;
    }

    if (lowerMessage.includes("risk") || lowerMessage.includes("safe")) {
      return `**Risk Management Guidelines:**

🛡️ **Essential Rules:**
1. **Position Sizing:** Never allocate more than 5% to a single asset
2. **Stop Losses:** Set at 15-20% below entry for volatile assets
3. **Diversification:** Spread across 5-10 different cryptocurrencies
4. **Emergency Fund:** Keep 10-20% in stablecoins

⚠️ **Red Flags to Avoid:**
- Projects promising guaranteed returns
- Anonymous teams
- No clear use case or whitepaper
- Excessive hype on social media
- Pump and dump schemes

✅ **Safety Checklist:**
- Use hardware wallets for large holdings
- Enable 2FA on all exchanges
- Never share private keys
- Verify contract addresses
- Research team and tokenomics`;
    }

    if (lowerMessage.includes("market") || lowerMessage.includes("trend")) {
      return `**Current Market Analysis:**

📈 **Market Sentiment:** Cautiously Optimistic

**Key Trends:**
1. **Institutional Adoption:** Growing interest from traditional finance
2. **Regulatory Clarity:** Improving framework in major markets
3. **DeFi Growth:** Continued innovation in decentralized finance
4. **Layer 2 Solutions:** Scaling solutions gaining traction

📊 **Technical Indicators:**
- Bitcoin dominance: Stable
- Market volatility: Moderate
- Trading volume: Healthy
- Fear & Greed Index: Neutral

💡 **Actionable Insights:**
- Good entry points during market corrections
- Focus on fundamentally strong projects
- Watch for regulatory news
- Monitor whale wallet movements`;
    }

    if (lowerMessage.includes("when") || lowerMessage.includes("timing") || lowerMessage.includes("buy now")) {
      return `**Market Timing Strategy:**

⏰ **Best Practices:**
- **Dollar-Cost Averaging (DCA):** Invest fixed amounts regularly (weekly/monthly)
- **Buy the Dip:** Accumulate during 20-30% corrections
- **Avoid FOMO:** Don't chase pumps or all-time highs
- **Be Patient:** Wait for clear entry signals

📊 **Entry Signals:**
✅ RSI below 30 (oversold)
✅ Price near major support levels
✅ Positive news catalysts
✅ Low fear & greed index

🚫 **Avoid Buying When:**
❌ Extreme greed in market
❌ Parabolic price movements
❌ Negative regulatory news
❌ Major exchange issues

💡 **Remember:** Time in the market beats timing the market. Consistent investing usually outperforms trying to catch perfect entries.`;
    }

    if (lowerMessage.includes("altcoin") || lowerMessage.includes("which coin")) {
      return `**Promising Altcoins to Watch:**

🌟 **Large Cap (Safer):**
1. **Solana (SOL)** - Fast, scalable blockchain
2. **Cardano (ADA)** - Research-driven approach
3. **Polygon (MATIC)** - Ethereum scaling solution

⚡ **Mid Cap (Moderate Risk):**
1. **Chainlink (LINK)** - Oracle network leader
2. **Avalanche (AVAX)** - High-performance platform
3. **Polkadot (DOT)** - Interoperability focus

🚀 **Small Cap (High Risk/Reward):**
- Research emerging DeFi protocols
- Look for strong communities
- Verify team credentials
- Check tokenomics carefully

⚠️ **Due Diligence:**
- Read the whitepaper
- Check GitHub activity
- Analyze token distribution
- Assess real-world use cases
- Review audit reports`;
    }

    if (lowerMessage.includes("sell") || lowerMessage.includes("take profit")) {
      return `**Profit-Taking Strategy:**

💰 **Systematic Approach:**

**Tier 1 (Conservative):**
- Sell 25% at 50% gain
- Sell 25% at 100% gain
- Hold 50% for long-term

**Tier 2 (Balanced):**
- Sell 20% at 30% gain
- Sell 30% at 75% gain
- Sell 30% at 150% gain
- Hold 20% for moonshot

**Tier 3 (Aggressive):**
- Hold through volatility
- Sell only at major resistance levels
- Target 200%+ gains

🎯 **Exit Signals:**
- Extreme greed (Fear & Greed Index >75)
- Parabolic price action
- Negative fundamental changes
- Portfolio rebalancing needs

💡 **Pro Tip:** Never sell everything at once. Scale out gradually to maximize gains while managing risk.`;
    }

    if (lowerMessage.includes("stablecoin") || lowerMessage.includes("usdt") || lowerMessage.includes("usdc")) {
      return `**Stablecoin Strategy:**

💵 **Top Stablecoins:**
1. **USDC** - Most transparent, regulated
2. **USDT** - Highest liquidity
3. **DAI** - Decentralized, algorithmic

📊 **Use Cases:**
- **Parking Cash:** During market uncertainty
- **Earning Yield:** 5-8% APY on lending platforms
- **Trading Pairs:** Quick entry/exit positions
- **Risk Management:** Preserve capital during downturns

💡 **Allocation Strategy:**
- Keep 10-20% in stablecoins
- Increase to 30-40% in bear markets
- Use for DCA purchases
- Emergency liquidity buffer

⚠️ **Safety Tips:**
- Prefer USDC for transparency
- Diversify across multiple stablecoins
- Use reputable platforms for yield
- Monitor depegging risks`;
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm here to help with your crypto investment questions. You can ask me about:\n\n• Investment recommendations\n• Market analysis\n• Portfolio strategies\n• Risk management\n• Specific cryptocurrencies\n• Trading strategies\n\nWhat would you like to know?";
    }

    if (lowerMessage.includes("thank")) {
      return "You're welcome! Feel free to ask me anything else about crypto investing. I'm here to help! 🚀";
    }

    // Default response for unrecognized queries
    return `I can help you with:

📊 **Market Analysis** - Current trends and sentiment
💼 **Investment Recommendations** - Portfolio allocation strategies
🎯 **Risk Management** - How to protect your investments
💰 **Specific Coins** - Analysis of BTC, ETH, and major altcoins
📈 **Trading Strategies** - Entry/exit timing and profit-taking
🔒 **Safety Tips** - Security and best practices

Try asking: "What should I invest in?" or "Tell me about Bitcoin" or "How do I manage risk?"`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-[#0f0f0f] border border-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Stash AI</h3>
            <p className="text-xs text-gray-400">Investment Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-gray-900 text-gray-100"
              }`}
            >
              <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-900 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about investments..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI-powered insights • Not financial advice
        </p>
      </div>
    </div>
  );
}
