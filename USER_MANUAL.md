# 📘 User Manual – OnChain CopyTrader AI

## 🔧 Prerequisites

Before proceeding, make sure you have:

- **Node.js** (v16+)
- **NPM** or **Yarn**
- **MetaMask** browser extension
- **A funded wallet** with testnet tokens
- **Python 3.x** (for AI simulation - optional)

## 📁 Project Setup

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd onchain-copytrader-ai
npm install
```

### Step 2: Environment Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Frontend contract addresses (update after deployment)
VITE_AGENT_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_COPY_TRADE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# Deployment configuration
SUPRA_RPC_URL=https://rpc.supra.com
PRIVATE_KEY=your_testnet_private_key_here
```

⚠️ **Security Note**: Never use mainnet private keys. Only use testnet keys for development.

## 🚀 Smart Contract Deployment

### Step 1: Install Hardhat Dependencies

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### Step 2: Deploy Contracts

For local testing:
```bash
# Start local Hardhat node (in separate terminal)
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

For Supra testnet:
```bash
npx hardhat run scripts/deploy.js --network supra
```

### Step 3: Update Contract Addresses

After deployment, copy the contract addresses from the console output and update your `.env` file:

```env
VITE_AGENT_REGISTRY_ADDRESS=0xYourAgentRegistryAddress
VITE_COPY_TRADE_ADDRESS=0xYourCopyTradeAddress
```

## 💻 Running the Application

### Development Mode

```bash
npm start
```

This starts:
- Frontend on `http://localhost:3000`
- Backend API on `http://localhost:3001`

### Production Build

```bash
npm run build
```

Built files will be in `dist/` directory.

## 🎮 Using the DApp

### 1. Connect Your Wallet

1. Open `http://localhost:3000`
2. Click **"Connect Wallet"** in the top right
3. Approve the MetaMask connection
4. Ensure you're on the correct network (Supra testnet or localhost)

### 2. Browse AI Agents

- View the **🏆 Leaderboard** tab to see all registered agents
- Agents are ranked by 12-month return performance
- See creator address, performance metrics, and copier count

### 3. Create an AI Agent

1. Click **🤖 Create Agent** tab
2. Fill in the form:
   - **Agent Name**: e.g., "SMA Crossover Bot"
   - **Strategy Type**: Choose from dropdown (SMA, RSI, MACD, etc.)
   - **12-Month Return**: Enter expected return percentage
3. Click **"Register Agent"**
4. Approve the transaction in MetaMask

### 4. Copy an Agent

1. In the Leaderboard, find an agent you want to copy
2. Click **"Copy Agent"** button
3. Approve the transaction in MetaMask
4. You'll now be following that agent's strategy

### 5. View Trade History

- Click **📈 Trade History** tab
- See all executed trades across the platform
- Filter by agent, user, or action type

## 🤖 AI Trading Simulation (Optional)

### Generate AI Trading Data

```bash
cd ai-trading
pip install pandas numpy
python ai_agent.py
```

This script:
- Simulates different trading strategies (SMA, RSI, etc.)
- Generates performance data
- Creates `simulation_results.json` with agent data

### Use Simulation Data

The generated data can be used to:
- Register agents with realistic performance metrics
- Test the platform with multiple agents
- Demonstrate different strategy types

## 🔧 Troubleshooting

### Common Issues

**1. "process is not defined" Error**
- ✅ Fixed: Use `import.meta.env` instead of `process.env`
- Make sure environment variables start with `VITE_`

**2. Contract Not Found**
- Check contract addresses in `.env` file
- Ensure contracts are deployed to the correct network
- Verify MetaMask is connected to the right network

**3. Transaction Reverted**
- Ensure you have enough testnet tokens for gas
- Check if agent ID exists when copying
- Verify contract addresses are correct

**4. MetaMask Connection Issues**
- Refresh the page
- Try disconnecting and reconnecting wallet
- Check if MetaMask is unlocked

### Network Configuration

For local testing, add Hardhat network to MetaMask:
- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

For Supra testnet, use:
- Network Name: Supra Testnet  
- RPC URL: https://rpc.supra.com
- Chain ID: 322 (replace with actual Supra chain ID)

## 📊 Understanding the Data

### Agent Performance
- **12M Return**: Annualized return percentage
- **Copier Count**: Number of users copying this agent
- **Created**: When the agent was registered

### Trade History
- **Agent ID**: Which agent triggered the trade
- **Action**: BUY or SELL
- **Asset**: Trading pair (default: ETH)
- **Amount**: Trade size in ETH
- **Timestamp**: When the trade was executed

## 🔒 Security Best Practices

1. **Never share private keys**
2. **Only use testnet tokens** for development
3. **Verify contract addresses** before transactions
4. **Double-check transaction details** in MetaMask
5. **Keep your wallet software updated**

## 📞 Getting Help

If you encounter issues:

1. **Check the browser console** for error messages
2. **Verify environment variables** are set correctly
3. **Ensure contracts are deployed** and addresses are updated
4. **Check MetaMask network** settings
5. **Review transaction history** in MetaMask

### Support Resources

- **GitHub Issues**: Report bugs or ask questions
- **Supra Documentation**: https://supra.com/docs
- **Hardhat Docs**: https://hardhat.org/docs
- **Ethers.js Docs**: https://docs.ethers.org/

## 🎯 Next Steps

After successfully running the application:

1. **Experiment** with different agent strategies
2. **Test** the copy trading functionality
3. **Explore** the trade history features
4. **Consider** integrating real price feeds
5. **Think about** additional features for production

---

**Happy Trading!** 🚀

*Remember: This is a prototype for demonstration. Never use real funds without proper auditing and testing.*