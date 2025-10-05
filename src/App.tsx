import { useEffect, useState } from 'react';
import { db } from './db';
import { tradeOperations, forecastOperations, databaseOperations } from './db/operations';

function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [stats, setStats] = useState({ trades: 0, forecasts: 0 });

  useEffect(() => {
    db.open().then(() => {
      setIsDbReady(true);
      loadStats();
    });
  }, []);

  const loadStats = async () => {
    const trades = await tradeOperations.getAllTrades();
    const forecasts = await forecastOperations.getAllForecasts();
    setStats({ trades: trades.length, forecasts: forecasts.length });
  };

  const addSampleData = async () => {
    await tradeOperations.addTrade({
      symbol: 'BTC/USD',
      tradeType: 'buy',
      entryPrice: 50000,
      quantity: 0.1,
      entryTime: new Date(),
      status: 'open',
      notes: 'Sample trade'
    });

    await forecastOperations.addForecast({
      symbol: 'BTC/USD',
      forecastType: 'price',
      prediction: { targetPrice: 55000, probability: 0.75 },
      confidenceScore: 85,
      timeframe: '1d',
      modelVersion: 'v1.0',
      forecastTime: new Date(),
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    loadStats();
  };

  const exportData = async () => {
    const data = await databaseOperations.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-data-${new Date().toISOString()}.json`;
    a.click();
  };

  if (!isDbReady) {
    return <div className="flex items-center justify-center min-h-screen">Loading database...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Trading Database</h1>
        <p className="text-slate-400 mb-8">Offline-first trading data with AI forecasts</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-2">Total Trades</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.trades}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-2">AI Forecasts</h3>
            <p className="text-3xl font-bold text-green-400">{stats.forecasts}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-4">Database Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={addSampleData}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Add Sample Data
            </button>
            <button
              onClick={exportData}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
            >
              Export Data
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span><strong>100% Offline</strong> - All data stored locally in your browser</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span><strong>Portable</strong> - Download and run on any PC</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span><strong>Export/Import</strong> - Transfer data between devices</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span><strong>AI Forecasts</strong> - Store predictions with confidence scores</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span><strong>Trade Tracking</strong> - Complete trade history and P&L</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
