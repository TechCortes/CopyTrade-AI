import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useContracts, Trade } from '../hooks/useContracts';

const TradeHistory: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getTradeHistory } = useContracts();

  const loadTrades = async () => {
    setIsLoading(true);
    try {
      const fetchedTrades = await getTradeHistory();
      // Sort by timestamp descending (newest first)
      const sortedTrades = fetchedTrades.sort((a, b) => b.timestamp - a.timestamp);
      setTrades(sortedTrades);
    } catch (error) {
      console.error('Failed to load trades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrades();
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getActionBadge = (action: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    const buyClasses = 'bg-green-100 text-green-800';
    const sellClasses = 'bg-red-100 text-red-800';
    
    return (
      <span className={`${baseClasses} ${action === 'BUY' ? buyClasses : sellClasses}`}>
        {action}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <div>Loading trade history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Recent Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No trades executed yet. Copy an agent to start trading!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">Agent #{trade.agentId}</TableCell>
                  <TableCell>{formatAddress(trade.user)}</TableCell>
                  <TableCell>{getActionBadge(trade.action)}</TableCell>
                  <TableCell>{trade.asset}</TableCell>
                  <TableCell>{trade.amount.toFixed(4)} ETH</TableCell>
                  <TableCell>{formatDate(trade.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeHistory;