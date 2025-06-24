import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useContracts, Agent } from '../hooks/useContracts';
import { useWeb3 } from '../hooks/useWeb3';

const AgentLeaderboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyingAgentId, setCopyingAgentId] = useState<number | null>(null);
  
  const { getAllAgents, copyAgent, loading } = useContracts();
  const { isConnected, connectWallet } = useWeb3();

  const loadAgents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedAgents = await getAllAgents();
      // Sort by 12-month return descending
      const sortedAgents = fetchedAgents.sort((a, b) => b.twelveMonthReturn - a.twelveMonthReturn);
      setAgents(sortedAgents);
    } catch (error) {
      console.error('Failed to load agents:', error);
      setError('Failed to load agents. Please refresh the page and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleCopyAgent = async (agentId: number) => {
    if (!isConnected) {
      try {
        await connectWallet();
        return;
      } catch (error) {
        setError('Please connect your wallet to copy an agent.');
        return;
      }
    }

    setCopyingAgentId(agentId);
    setError(null);

    try {
      await copyAgent(agentId);
      
      // Show success message
      const agent = agents.find(a => a.id === agentId);
      setError(null);
      
      // Reload agents to update copier count
      await loadAgents();
      
      // You could add a success toast here instead of alert
      console.log(`Successfully copied agent: ${agent?.name || agentId}`);
    } catch (error: any) {
      console.error('Failed to copy agent:', error);
      
      let errorMessage = 'Failed to copy agent. Please try again.';
      
      if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction rejected. Please approve the transaction to copy this agent.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees. Please add more ETH to your wallet.';
      } else if (error.message?.includes('Agent does not exist')) {
        errorMessage = 'This agent no longer exists. Please refresh the page.';
      }
      
      setError(errorMessage);
    } finally {
      setCopyingAgentId(null);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            <span>Loading agents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🏆 AI Trading Agent Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No agents registered yet. Be the first to create one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>12M Return</TableHead>
                  <TableHead>Copiers</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent, index) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </TableCell>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{formatAddress(agent.creator)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          agent.twelveMonthReturn >= 0
                            ? 'text-green-600 font-semibold'
                            : 'text-red-600 font-semibold'
                        }
                      >
                        {agent.twelveMonthReturn >= 0 ? '+' : ''}
                        {agent.twelveMonthReturn.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell>{agent.copierCount}</TableCell>
                    <TableCell>{formatDate(agent.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleCopyAgent(agent.id)}
                        disabled={loading || copyingAgentId === agent.id}
                      >
                        {copyingAgentId === agent.id ? 'Copying...' : 'Copy Agent'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <span className="text-red-500">⚠️</span>
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="text-xs text-red-600 hover:text-red-800 p-0 h-auto mt-1"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentLeaderboard;