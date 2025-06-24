import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWeb3 } from '../hooks/useWeb3';

const WalletConnect: React.FC = () => {
  const { account, isConnected, error, connectWallet, disconnectWallet, clearError } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    clearError();
    
    try {
      await connectWallet();
    } catch (error) {
      // Error is already handled in useWeb3 hook
      console.log('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    clearError();
  };

  if (isConnected && account) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">{formatAddress(account)}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-2">
      <Card>
        <CardContent className="flex items-center justify-center p-4">
          <Button 
            onClick={handleConnect} 
            className="w-full"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </CardContent>
      </Card>
      
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3">
            <div className="flex items-start space-x-2">
              <span className="text-red-500 text-sm">⚠️</span>
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
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

export default WalletConnect;