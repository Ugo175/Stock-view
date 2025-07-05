import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import stockService from '../services/stockService';
import tradingService from '../services/tradingService';
import TradeModal from '../components/TradeModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stocksResponse, portfolioResponse, balanceResponse] = await Promise.all([
        stockService.getAllStocks(),
        tradingService.getPortfolio(),
        tradingService.getBalance()
      ]);

      setStocks(stocksResponse.data);
      setPortfolio(portfolioResponse.data);
      setBalance(balanceResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTradeClick = (stock) => {
    setSelectedStock(stock);
    setShowTradeModal(true);
  };

  const handleTradeComplete = () => {
    fetchData(); // Refresh data after trade
  };

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const portfolioValue = portfolio.reduce((total, item) => {
    const stock = stocks.find(s => s.symbol === item.stockSymbol);
    return total + (stock ? stock.price * item.quantity : 0);
  }, 0);

  const totalValue = balance + portfolioValue;

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ margin: '2rem 0' }}>Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">${balance.toFixed(2)}</div>
          <div className="stat-label">Cash Balance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${portfolioValue.toFixed(2)}</div>
          <div className="stat-label">Portfolio Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${totalValue.toFixed(2)}</div>
          <div className="stat-label">Total Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{portfolio.length}</div>
          <div className="stat-label">Holdings</div>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="stock-list">
        {filteredStocks.map(stock => {
          const holding = portfolio.find(p => p.stockSymbol === stock.symbol);
          
          return (
            <div key={stock.id} className="stock-item">
              <div className="stock-symbol">{stock.symbol}</div>
              <div className="stock-name">{stock.name}</div>
              <div className="stock-price">${stock.price.toFixed(2)}</div>
              <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </div>
              
              {holding && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#059669' }}>
                  Owned: {holding.quantity} shares (Avg: ${holding.averagePrice.toFixed(2)})
                </div>
              )}

              <div className="trade-buttons">
                <button
                  onClick={() => handleTradeClick(stock)}
                  className="btn btn-success"
                >
                  Trade
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showTradeModal && selectedStock && (
        <TradeModal
          stock={selectedStock}
          isOpen={showTradeModal}
          onClose={() => setShowTradeModal(false)}
          onTradeComplete={handleTradeComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;
