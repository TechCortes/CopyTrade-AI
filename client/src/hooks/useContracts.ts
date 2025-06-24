import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

// Contract ABIs (simplified)
const AGENT_REGISTRY_ABI = [
  "function registerAgent(string memory name, string memory strategyHash, uint256 return12M) external",
  "function copyAgent(uint256 agentId) external",
  "function getAgent(uint256 agentId) external view returns (tuple(address creator, string name, string strategyHash, uint256 twelveMonthReturn, uint256 copierCount, uint256 createdAt))",
  "function getAllAgents() external view returns (tuple(address creator, string name, string strategyHash, uint256 twelveMonthReturn, uint256 copierCount, uint256 createdAt)[])",
  "function nextAgentId() external view returns (uint256)",
  "event AgentRegistered(uint256 agentId, address creator, string name)",
  "event AgentCopied(uint256 agentId, address copier)"
];

const COPY_TRADE_ABI = [
  "function executeTrade(uint256 agentId, string memory action, string memory asset, uint256 amount) external",
  "function getTradeHistory() external view returns (tuple(uint256 agentId, address user, string action, string asset, uint256 amount, uint256 timestamp)[])",
  "function getUserTrades(address user) external view returns (uint256[])",
  "event TradeExecuted(uint256 agentId, address user, string action, string asset, uint256 amount)"
];

// Contract addresses (update these after deployment)
const AGENT_REGISTRY_ADDRESS = import.meta.env.VITE_AGENT_REGISTRY_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const COPY_TRADE_ADDRESS = import.meta.env.VITE_COPY_TRADE_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export interface Agent {
  id: number;
  creator: string;
  name: string;
  strategyHash: string;
  twelveMonthReturn: number;
  copierCount: number;
  createdAt: number;
}

export interface Trade {
  agentId: number;
  user: string;
  action: string;
  asset: string;
  amount: number;
  timestamp: number;
}

export const useContracts = () => {
  const { provider, signer, isConnected } = useWeb3();
  const [agentRegistry, setAgentRegistry] = useState<ethers.Contract | null>(null);
  const [copyTrade, setCopyTrade] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider && isConnected) {
      const registry = new ethers.Contract(AGENT_REGISTRY_ADDRESS, AGENT_REGISTRY_ABI, provider);
      const copy = new ethers.Contract(COPY_TRADE_ADDRESS, COPY_TRADE_ABI, provider);
      
      setAgentRegistry(registry);
      setCopyTrade(copy);
    }
  }, [provider, isConnected]);

  const registerAgent = async (name: string, strategyHash: string, return12M: number) => {
    if (!agentRegistry || !signer) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const contract = agentRegistry.connect(signer);
      const tx = await contract.registerAgent(name, strategyHash, Math.floor(return12M * 100)); // Convert to basis points
      await tx.wait();
      return tx;
    } finally {
      setLoading(false);
    }
  };

  const copyAgent = async (agentId: number) => {
    if (!agentRegistry || !signer) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const contract = agentRegistry.connect(signer);
      const tx = await contract.copyAgent(agentId);
      await tx.wait();
      return tx;
    } finally {
      setLoading(false);
    }
  };

  const executeTrade = async (agentId: number, action: string, asset: string, amount: number) => {
    if (!copyTrade || !signer) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const contract = copyTrade.connect(signer);
      const tx = await contract.executeTrade(agentId, action, asset, ethers.parseEther(amount.toString()));
      await tx.wait();
      return tx;
    } finally {
      setLoading(false);
    }
  };

  const getAllAgents = async (): Promise<Agent[]> => {
    if (!agentRegistry) return [];
    
    try {
      const agents = await agentRegistry.getAllAgents();
      return agents.map((agent: any, index: number) => ({
        id: index,
        creator: agent.creator,
        name: agent.name,
        strategyHash: agent.strategyHash,
        twelveMonthReturn: Number(agent.twelveMonthReturn) / 100, // Convert from basis points
        copierCount: Number(agent.copierCount),
        createdAt: Number(agent.createdAt),
      }));
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  };

  const getTradeHistory = async (): Promise<Trade[]> => {
    if (!copyTrade) return [];
    
    try {
      const trades = await copyTrade.getTradeHistory();
      return trades.map((trade: any) => ({
        agentId: Number(trade.agentId),
        user: trade.user,
        action: trade.action,
        asset: trade.asset,
        amount: parseFloat(ethers.formatEther(trade.amount)),
        timestamp: Number(trade.timestamp),
      }));
    } catch (error) {
      console.error('Error fetching trades:', error);
      return [];
    }
  };

  return {
    agentRegistry,
    copyTrade,
    loading,
    registerAgent,
    copyAgent,
    executeTrade,
    getAllAgents,
    getTradeHistory,
  };
};