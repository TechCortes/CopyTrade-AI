# OnChain CopyTrader AI

> Decentralized AI Trading Agent Marketplace on Supra Blockchain

## Problem Statement

Many retail investors want to benefit from algorithmic trading strategies but don't know how to create or trust bots. Platforms like eToro allow copy trading, but without visibility or decentralization of the agent logic or its performance.

## Solution

A decentralized platform where AI trading agents can publish their strategies on-chain (Supra), show verifiable historical performance, and allow users to copy them trustlessly using smart contracts.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Smart Contracts**: Solidity (EVM-compatible on Supra)
- **Blockchain**: Supra Network
- **Web3 Integration**: Ethers.js v6
- **AI Trading**: Python (pandas, numpy) for strategy simulation
- **Build Tool**: Vite
- **Deployment**: Hardhat

## Project Structure

```
onchain-copytrader-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Web3 and contract hooks
│   │   └── lib/           # Utilities
├── contracts/             # Smart contracts
│   ├── AgentRegistry.sol  # Agent registration & metadata
│   └── CopyTradeSimulator.sol # Copy trading simulation
├── scripts/               # Deployment scripts
├── ai-trading/           # AI trading simulation
└── hardhat.config.js     # Hardhat configuration
```

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_AGENT_REGISTRY_ADDRESS` - Contract address after deployment
- `VITE_COPY_TRADE_ADDRESS` - Contract address after deployment
- `PRIVATE_KEY` - Your wallet private key for deployment
- `SUPRA_RPC_URL` - Supra network RPC endpoint

### 3. Deploy Smart Contracts

```bash
# Install Hardhat dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Deploy to local network (for testing)
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Supra network
npx hardhat run scripts/deploy.js --network supra
```

### 4. Start Development Server

```bash
npm start
```

This will start both the frontend (port 3000) and backend (port 3001).

## AI Trading Simulation

Run the AI trading agent simulation:

```bash
cd ai-trading
pip install pandas numpy
python ai_agent.py
```

This generates trading performance data that can be used to register agents.

## Features

### Implemented

- **Agent Registration**: Create and register AI trading agents on-chain
- **Performance Tracking**: Store and display agent performance metrics
- **Copy Trading**: Users can copy successful agents
- **Leaderboard**: Rank agents by performance
- **Trade History**: View all executed trades
- **Wallet Integration**: MetaMask connection and management

### Smart Contracts

#### AgentRegistry.sol
- Register new trading agents
- Store agent metadata and performance
- Track copier counts
- Emit events for registration and copying

#### CopyTradeSimulator.sol  
- Execute simulated trades
- Store trade history on-chain
- Track user trading activity
- Emit trade execution events

## Usage

1. **Connect Wallet**: Connect your MetaMask wallet
2. **Browse Agents**: View the leaderboard of top-performing AI agents
3. **Create Agent**: Register your own AI trading strategy
4. **Copy Trading**: Select an agent and copy their trading strategy
5. **Track Performance**: Monitor your copied trades and performance

## Configuration

### Network Configuration

The project supports multiple networks via Hardhat:

- **Local**: Hardhat local network for testing
- **Supra**: Supra blockchain network
- **Sepolia**: Ethereum testnet (fallback)

### Frontend Configuration

The React app uses Vite for fast development and building. Key configurations:

- TypeScript support
- Tailwind CSS for styling
- shadcn/ui components
- Path aliases (`@/` maps to `client/src/`)

## Deployment

### Smart Contracts

```bash
# Deploy to Supra
npx hardhat run scripts/deploy.js --network supra

# Verify contracts (optional)
npx hardhat verify --network supra DEPLOYED_ADDRESS
```

### Frontend

```bash
# Build for production
npm run build

# Serve static files
# The built files are in dist/public/
```

## Testing

### Local Development

1. Start a local Hardhat node:
```bash
npx hardhat node
```

2. Deploy contracts to local network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Update contract addresses in `.env` file

4. Start the development server:
```bash
npm start
```

## Security Considerations

**This is a hackathon prototype. Do not use with real funds.**

- Smart contracts are not audited
- Private keys should never be committed to version control
- Use testnet tokens only
- Implement proper access controls in production

## Roadmap

### Phase 1 (Current - Hackathon)
- Basic agent registration
- Copy trading simulation
- Performance tracking
- Web3 integration

### Phase 2 (Post-Hackathon)
- Real exchange integration via Supra Oracles
- Advanced AI strategies (ML-based)
- Revenue sharing mechanisms
- Mobile app integration

### Phase 3 (Future)
- Cross-chain compatibility
- Institutional features
- Advanced analytics
- Governance token

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support:
- Create an issue on GitHub
- Contact: dev@zeosuperapp.com
- Documentation: [Supra Docs](https://supra.com/docs)

---

**Built for Supra Hackathon 2024**

*Democratizing AI-powered trading through blockchain technology*