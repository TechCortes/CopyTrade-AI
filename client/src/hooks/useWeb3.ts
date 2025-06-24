import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  error: string | null;
}

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    isConnected: false,
    error: null,
  });

  const connectWallet = async () => {
    try {
      // Clear any previous errors
      setWeb3State(prev => ({ ...prev, error: null }));

      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      
      setWeb3State({
        provider,
        signer,
        account,
        chainId: Number(network.chainId),
        isConnected: true,
        error: null,
      });
      
      console.log('Wallet connected successfully:', account);
      return { provider, signer, account };
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      let errorMessage = 'Failed to connect wallet. Please try again.';
      
      // Handle specific error types
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = 'Connection rejected. Please approve the connection in MetaMask to continue.';
      } else if (error.code === -32002) {
        errorMessage = 'MetaMask is already processing a request. Please check MetaMask.';
      } else if (error.message?.includes('MetaMask is not installed')) {
        errorMessage = error.message;
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Connection rejected. Please approve the connection to continue.';
      }
      
      setWeb3State(prev => ({
        ...prev,
        error: errorMessage,
        isConnected: false,
      }));
      
      throw new Error(errorMessage);
    }
  };

  const disconnectWallet = () => {
    setWeb3State({
      provider: null,
      signer: null,
      account: null,
      chainId: null,
      isConnected: false,
      error: null,
    });
    console.log('Wallet disconnected');
  };

  const clearError = () => {
    setWeb3State(prev => ({ ...prev, error: null }));
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const account = await signer.getAddress();
            const network = await provider.getNetwork();
            
            setWeb3State({
              provider,
              signer,
              account,
              chainId: Number(network.chainId),
              isConnected: true,
              error: null,
            });
            
            console.log('Auto-connected to wallet:', account);
          }
        }
      } catch (error) {
        console.error('Failed to check existing connection:', error);
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkConnection();
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (typeof window.ethereum !== 'undefined') {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return {
    ...web3State,
    connectWallet,
    disconnectWallet,
    clearError,
  };
};