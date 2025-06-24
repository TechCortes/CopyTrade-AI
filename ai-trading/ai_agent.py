import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import random

class AITradingAgent:
    def __init__(self, strategy_type="sma_crossover", params=None):
        self.strategy_type = strategy_type
        self.params = params or self.get_default_params()
        self.trades = []
        self.performance = {}

    def get_default_params(self):
        """Default parameters for different strategies"""
        defaults = {
            "sma_crossover": {"short_window": 10, "long_window": 50},
            "rsi": {"rsi_period": 14, "overbought": 70, "oversold": 30},
            "macd": {"fast": 12, "slow": 26, "signal": 9}
        }
        return defaults.get(self.strategy_type, {})

    def generate_sample_data(self, days=365):
        """Generate sample price data for simulation"""
        dates = pd.date_range(start=datetime.now() - timedelta(days=days), periods=days, freq='D')
        
        # Generate realistic price movements
        initial_price = 100
        returns = np.random.normal(0.001, 0.02, days)  # Daily returns with slight upward bias
        prices = [initial_price]
        
        for return_rate in returns[1:]:
            prices.append(prices[-1] * (1 + return_rate))
        
        return pd.DataFrame({
            'Date': dates,
            'Close': prices,
            'Volume': np.random.randint(1000, 10000, days)
        })

    def sma_strategy(self, data):
        """Simple Moving Average Crossover Strategy"""
        short_window = self.params.get("short_window", 10)
        long_window = self.params.get("long_window", 50)
        
        data['SMA_short'] = data['Close'].rolling(window=short_window).mean()
        data['SMA_long'] = data['Close'].rolling(window=long_window).mean()
        
        # Generate signals
        data['Signal'] = 0
        data.loc[data['SMA_short'] > data['SMA_long'], 'Signal'] = 1  # Buy
        data.loc[data['SMA_short'] < data['SMA_long'], 'Signal'] = -1  # Sell
        
        return data

    def rsi_strategy(self, data):
        """RSI Strategy"""
        period = self.params.get("rsi_period", 14)
        overbought = self.params.get("overbought", 70)
        oversold = self.params.get("oversold", 30)
        
        # Calculate RSI
        delta = data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        data['RSI'] = 100 - (100 / (1 + rs))
        
        # Generate signals
        data['Signal'] = 0
        data.loc[data['RSI'] < oversold, 'Signal'] = 1  # Buy
        data.loc[data['RSI'] > overbought, 'Signal'] = -1  # Sell
        
        return data

    def backtest(self, data):
        """Backtest the strategy"""
        if self.strategy_type == "sma_crossover":
            data = self.sma_strategy(data)
        elif self.strategy_type == "rsi":
            data = self.rsi_strategy(data)
        
        # Simulate trading
        capital = 10000
        position = 0
        trades = []
        
        for i in range(1, len(data)):
            current_signal = data['Signal'].iloc[i]
            prev_signal = data['Signal'].iloc[i-1]
            price = data['Close'].iloc[i]
            date = data['Date'].iloc[i]
            
            # Enter long position
            if current_signal == 1 and prev_signal != 1 and position == 0:
                position = capital / price
                capital = 0
                trades.append({
                    'date': date.isoformat(),
                    'action': 'BUY',
                    'price': price,
                    'shares': position
                })
            
            # Exit position
            elif current_signal == -1 and position > 0:
                capital = position * price
                trades.append({
                    'date': date.isoformat(),
                    'action': 'SELL',
                    'price': price,
                    'shares': position
                })
                position = 0
        
        # Calculate final value
        final_value = capital + (position * data['Close'].iloc[-1])
        total_return = ((final_value - 10000) / 10000) * 100
        
        self.trades = trades
        self.performance = {
            'total_return': round(total_return, 2),
            'final_value': round(final_value, 2),
            'number_of_trades': len(trades),
            'strategy': self.strategy_type,
            'params': self.params
        }
        
        return self.performance

    def get_agent_summary(self):
        """Get agent summary for blockchain registration"""
        return {
            'strategy_type': self.strategy_type,
            'params': self.params,
            'performance': self.performance,
            'trades_sample': self.trades[-5:] if len(self.trades) > 5 else self.trades
        }

def simulate_multiple_agents():
    """Simulate multiple AI agents with different strategies"""
    agents = []
    
    # SMA Crossover variants
    for short, long in [(5, 20), (10, 50), (20, 100)]:
        agent = AITradingAgent("sma_crossover", {"short_window": short, "long_window": long})
        data = agent.generate_sample_data()
        performance = agent.backtest(data)
        agents.append({
            'name': f'SMA Bot ({short}/{long})',
            'agent': agent,
            'performance': performance
        })
    
    # RSI variants
    for rsi_period, oversold, overbought in [(14, 30, 70), (21, 25, 75)]:
        agent = AITradingAgent("rsi", {
            "rsi_period": rsi_period, 
            "oversold": oversold, 
            "overbought": overbought
        })
        data = agent.generate_sample_data()
        performance = agent.backtest(data)
        agents.append({
            'name': f'RSI Bot ({rsi_period}/{oversold}/{overbought})',
            'agent': agent,
            'performance': performance
        })
    
    return agents

if __name__ == "__main__":
    print("🤖 AI Trading Agent Simulator")
    print("=" * 40)
    
    # Simulate single agent
    agent = AITradingAgent("sma_crossover", {"short_window": 10, "long_window": 50})
    data = agent.generate_sample_data()
    performance = agent.backtest(data)
    
    print(f"Strategy: {agent.strategy_type}")
    print(f"Parameters: {agent.params}")
    print(f"12-Month Return: {performance['total_return']}%")
    print(f"Final Portfolio Value: ${performance['final_value']}")
    print(f"Number of Trades: {performance['number_of_trades']}")
    
    print("\n📊 Multiple Agents Simulation:")
    print("-" * 40)
    
    agents = simulate_multiple_agents()
    agents.sort(key=lambda x: x['performance']['total_return'], reverse=True)
    
    for i, agent_data in enumerate(agents[:5], 1):
        perf = agent_data['performance']
        print(f"{i}. {agent_data['name']}: {perf['total_return']}% return")
    
    # Save results for frontend
    results = {
        'agents': [
            {
                'name': agent_data['name'],
                'performance': agent_data['performance'],
                'summary': agent_data['agent'].get_agent_summary()
            }
            for agent_data in agents
        ],
        'generated_at': datetime.now().isoformat()
    }
    
    with open('simulation_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to simulation_results.json")