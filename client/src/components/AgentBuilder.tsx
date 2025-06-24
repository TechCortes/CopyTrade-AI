import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContracts } from '../hooks/useContracts';
import { useWeb3 } from '../hooks/useWeb3';

const AgentBuilder: React.FC = () => {
  const [name, setName] = useState('');
  const [strategy, setStrategy] = useState('');
  const [returnRate, setReturnRate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { registerAgent, loading } = useContracts();
  const { isConnected, connectWallet } = useWeb3();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isConnected) {
      try {
        await connectWallet();
        return;
      } catch (error) {
        setError('Please connect your wallet to continue.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const strategyHash = `strategy_${strategy}_${Date.now()}`;
      await registerAgent(name, strategyHash, parseFloat(returnRate));
      
      // Reset form
      setName('');
      setStrategy('');
      setReturnRate('');
      
      setSuccess('Agent registered successfully! Check the leaderboard to see your agent.');
    } catch (error: any) {
      console.error('Failed to register agent:', error);
      
      let errorMessage = 'Failed to register agent. Please try again.';
      
      if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction rejected. Please approve the transaction to register your agent.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for gas fees. Please add more ETH to your wallet.';
      } else if (error.message?.includes('Contract not initialized')) {
        errorMessage = 'Smart contracts not loaded. Please refresh the page and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create AI Trading Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="agent-name">Agent Name</Label>
              <Input
                id="agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., SMA Crossover Bot"
                required
              />
            </div>

            <div>
              <Label htmlFor="strategy">Strategy Type</Label>
              <Select value={strategy} onValueChange={setStrategy} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a trading strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sma_crossover">SMA Crossover</SelectItem>
                  <SelectItem value="rsi">RSI Strategy</SelectItem>
                  <SelectItem value="macd">MACD Trend Following</SelectItem>
                  <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="return-rate">12-Month Return (%)</Label>
              <Input
                id="return-rate"
                type="number"
                step="0.01"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
                placeholder="e.g., 15.5"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || isSubmitting}
            >
              {!isConnected
                ? 'Connect Wallet'
                : isSubmitting
                ? 'Registering...'
                : 'Register Agent'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="max-w-md mx-auto border-red-200 bg-red-50">
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

      {success && (
        <Card className="max-w-md mx-auto border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <span className="text-green-500">✅</span>
              <div className="flex-1">
                <p className="text-sm text-green-700">{success}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSuccess(null)}
                  className="text-xs text-green-600 hover:text-green-800 p-0 h-auto mt-1"
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

export default AgentBuilder;