// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CopyTradeSimulator {
    struct Trade {
        uint256 agentId;
        address user;
        string action;
        string asset;
        uint256 amount;
        uint256 timestamp;
    }

    Trade[] public tradeHistory;
    mapping(address => uint256[]) public userTrades;

    event TradeExecuted(uint256 agentId, address user, string action, string asset, uint256 amount);

    function executeTrade(
        uint256 agentId, 
        string memory action, 
        string memory asset, 
        uint256 amount
    ) external {
        uint256 tradeId = tradeHistory.length;
        
        tradeHistory.push(Trade({
            agentId: agentId,
            user: msg.sender,
            action: action,
            asset: asset,
            amount: amount,
            timestamp: block.timestamp
        }));

        userTrades[msg.sender].push(tradeId);

        emit TradeExecuted(agentId, msg.sender, action, asset, amount);
    }

    function getTradeHistory() external view returns (Trade[] memory) {
        return tradeHistory;
    }

    function getUserTrades(address user) external view returns (uint256[] memory) {
        return userTrades[user];
    }

    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        require(tradeId < tradeHistory.length, "Trade does not exist");
        return tradeHistory[tradeId];
    }
}