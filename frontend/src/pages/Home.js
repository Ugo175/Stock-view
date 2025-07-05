import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import stockService from '../services/stockService';

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await stockService.getAllStocks();
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await stockService.searchStocks(searchTerm);
        setStocks(response.data);
      } catch (error) {
        console.error('Error searching stocks:', error);
      }
    } else {
      fetchStocks();
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading stocks...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1f2937' }}>
          Welcome to StockView
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
          Your gateway to smart stock trading
        </p>
        <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
          Get Started
        </Link>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="stock-list">
        {filteredStocks.map(stock => (
          <div key={stock.id} className="stock-item">
            <div className="stock-symbol">{stock.symbol}</div>
            <div className="stock-name">{stock.name}</div>
            <div className="stock-price">${stock.price.toFixed(2)}</div>
            <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
              <div>Volume: {stock.volume.toLocaleString()}</div>
              <div>Market Cap: ${(stock.marketCap / 1000000000).toFixed(2)}B</div>
              <div>Sector: {stock.sector}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredStocks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          No stocks found matching your search.
        </div>
      )}
    </div>
  );
};

export default Home;
