import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import stockService from '../services/stockService';
import tradingService from '../services/tradingService';

const Portfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('holdings');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portfolioResponse, transactionsResponse, stocksResponse] = await Promise.all([
        tradingService.getPortfolio(),
        tradingService.getTransactions(),
        stockService.getAllStocks()
      ]);

      setPortfolio(portfolioResponse.data);
      setTransactions(transactionsResponse.data);
      setStocks(stocksResponse.data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockCurrentPrice = (symbol) => {
    const stock = stocks.find(s => s.symbol === symbol);
    return stock ? stock.price : 0;
  };

  const calculateGainLoss = (holding) => {
    const currentPrice = getStockCurrentPrice(holding.stockSymbol);
    const totalCost = holding.averagePrice * holding.quantity;
    const currentValue = currentPrice * holding.quantity;
    return currentValue - totalCost;
  };

  const calculateGainLossPercent = (holding) => {
    const gainLoss = calculateGainLoss(holding);
    const totalCost = holding.averagePrice * holding.quantity;
    return totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
  };

  const totalPortfolioValue = portfolio.reduce((total, holding) => {
    const currentPrice = getStockCurrentPrice(holding.stockSymbol);
    return total + (currentPrice * holding.quantity);
  }, 0);

  const totalGainLoss = portfolio.reduce((total, holding) => {
    return total + calculateGainLoss(holding);
  }, 0);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ margin: '2rem 0' }}>Portfolio</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">${totalPortfolioValue.toFixed(2)}</div>
          <div className="stat-label">Total Value</div>
        </div>
        <div className="stat-card">
          <div className={`stat-value ${totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
            ${totalGainLoss.toFixed(2)}
          </div>
          <div className="stat-label">Total Gain/Loss</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{portfolio.length}</div>
          <div className="stat-label">Holdings</div>
        </div>
      </div>

      <div style={{ margin: '2rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            className={`btn ${activeTab === 'holdings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('holdings')}
          >
            Holdings
          </button>
          <button
            className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </div>

        {activeTab === 'holdings' && (
          <div className="card">
            <div className="card-header">
              <h3>Current Holdings</h3>
            </div>
            <div className="card-body">
              {portfolio.length === 0 ? (
                <p>No holdings yet. Start trading to build your portfolio!</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Symbol</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Quantity</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Avg Price</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Current Price</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Current Value</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Gain/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((holding, index) => {
                        const currentPrice = getStockCurrentPrice(holding.stockSymbol);
                        const currentValue = currentPrice * holding.quantity;
                        const gainLoss = calculateGainLoss(holding);
                        const gainLossPercent = calculateGainLossPercent(holding);

                        return (
                          <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                              {holding.stockSymbol}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                              {holding.quantity}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                              ${holding.averagePrice.toFixed(2)}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                              ${currentPrice.toFixed(2)}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                              ${currentValue.toFixed(2)}
                            </td>
                            <td style={{ 
                              padding: '0.75rem', 
                              textAlign: 'right', 
                              color: gainLoss >= 0 ? '#10b981' : '#ef4444' 
                            }}>
                              ${gainLoss.toFixed(2)} ({gainLossPercent.toFixed(2)}%)
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="card">
            <div className="card-header">
              <h3>Transaction History</h3>
            </div>
            <div className="card-body">
              {transactions.length === 0 ? (
                <p>No transactions yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Symbol</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Type</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Quantity</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Price</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.75rem' }}>
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                            {transaction.stockSymbol}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{ 
                              color: transaction.type === 'BUY' ? '#10b981' : '#ef4444',
                              fontWeight: 'bold'
                            }}>
                              {transaction.type}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            {transaction.quantity}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            ${transaction.price.toFixed(2)}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                            ${transaction.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
