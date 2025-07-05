import React, { useState } from 'react';
import tradingService from '../services/tradingService';
import { useAuth } from '../contexts/AuthContext';

const TradeModal = ({ stock, isOpen, onClose, onTradeComplete }) => {
  const [tradeType, setTradeType] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateBalance } = useAuth();

  const handleTrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (tradeType === 'BUY') {
        await tradingService.buyStock(stock.symbol, quantity);
      } else {
        await tradingService.sellStock(stock.symbol, quantity);
      }

      // Update balance
      const balanceResponse = await tradingService.getBalance();
      updateBalance(balanceResponse.data);

      onTradeComplete();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalCost = stock.price * quantity;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            Trade {stock.symbol}
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleTrade}>
          <div className="form-group">
            <label>Trade Type</label>
            <select 
              value={tradeType} 
              onChange={(e) => setTradeType(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Price per Share</label>
            <input
              type="text"
              value={`$${stock.price.toFixed(2)}`}
              readOnly
              style={{ backgroundColor: '#f9fafb' }}
            />
          </div>

          <div className="form-group">
            <label>Total {tradeType === 'BUY' ? 'Cost' : 'Revenue'}</label>
            <input
              type="text"
              value={`$${totalCost.toFixed(2)}`}
              readOnly
              style={{ backgroundColor: '#f9fafb' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className={`btn ${tradeType === 'BUY' ? 'btn-success' : 'btn-danger'}`}
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Processing...' : `${tradeType} ${stock.symbol}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
