import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import stockService from '../services/stockService';
import TradeModal from '../components/TradeModal';

const StockDetail = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTradeModal, setShowTradeModal] = useState(false);

  useEffect(() => {
    fetchStock();
  }, [symbol]);

  const fetchStock = async () => {
    try {
      const response = await stockService.getStockBySymbol(symbol);
      setStock(response.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTradeComplete = () => {
    // Could refresh stock data or show success message
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading stock details...</div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Stock not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ margin: '2rem 0' }}>
        <div className="card">
          <div className="card-header">
            <h1>{stock.symbol} - {stock.name}</h1>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div>
                <h3>Price Information</h3>
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`} style={{ fontSize: '1.1rem' }}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>

              <div>
                <h3>Market Data</h3>
                <div style={{ marginTop: '1rem' }}>
                  <div><strong>Volume:</strong> {stock.volume.toLocaleString()}</div>
                  <div><strong>Market Cap:</strong> ${(stock.marketCap / 1000000000).toFixed(2)}B</div>
                  <div><strong>Sector:</strong> {stock.sector}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3>About {stock.name}</h3>
              <p style={{ marginTop: '1rem', lineHeight: '1.6', color: '#4b5563' }}>
                {stock.description}
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={() => setShowTradeModal(true)}
                className="btn btn-primary"
                style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
              >
                Trade {stock.symbol}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTradeModal && (
        <TradeModal
          stock={stock}
          isOpen={showTradeModal}
          onClose={() => setShowTradeModal(false)}
          onTradeComplete={handleTradeComplete}
        />
      )}
    </div>
  );
};

export default StockDetail;
