import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AgentBuilder from "./components/AgentBuilder";
import AgentLeaderboard from "./components/AgentLeaderboard";
import TradeHistory from "./components/TradeHistory";
import WalletConnect from "./components/WalletConnect";

function App() {
  const [activeTab, setActiveTab] = useState("leaderboard");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              OnChain CopyTrader AI
            </h1>
            <p className="text-lg mt-2 text-[#000000]">
              Decentralized AI Trading Agents on Supra Blockchain
            </p>
          </div>
          <WalletConnect />
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mb-8">
          <Button
            variant={activeTab === "leaderboard" ? "default" : "outline"}
            onClick={() => handleTabClick("leaderboard")}
          >
            🏆 Leaderboard
          </Button>
          <Button
            variant={activeTab === "builder" ? "default" : "outline"}
            onClick={() => handleTabClick("builder")}
          >
            🤖 Create Agent
          </Button>
          <Button
            variant={activeTab === "trades" ? "default" : "outline"}
            onClick={() => handleTabClick("trades")}
          >
            📈 Trade History
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {activeTab === "leaderboard" && (
            <div>
              <AgentLeaderboard />
            </div>
          )}

          {activeTab === "builder" && (
            <div className="flex justify-center">
              <AgentBuilder />
            </div>
          )}

          {activeTab === "trades" && (
            <div>
              <TradeHistory />
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔐</span>
                <span>Trustless</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#ffffffff]">
                All trading logic and performance data is stored on-chain,
                ensuring transparency and trust.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🤖</span>
                <span>AI-Powered</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#fff7f7ff]">
                Advanced trading strategies powered by AI algorithms like SMA,
                RSI, and MACD.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Supra-Fast</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#f5f4f4ff]">
                Built on Supra blockchain for high-speed, low-cost transactions
                and oracle integration.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p className="text-[#000000]">
            © 2025 OnChain CopyTrader AI - Built for Supra Hackathon
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
