# Offline Trading Database

This database uses IndexedDB (via Dexie.js) to store all trading data locally in your browser. All data persists on your PC and works completely offline.

## Features

- **100% Offline**: Works without internet connection
- **Portable**: Download files and run on any PC
- **Persistent**: Data survives browser restarts
- **Fast**: Indexed queries for quick data retrieval
- **Export/Import**: Backup and transfer data between devices

## Database Schema

### Tables

1. **trades** - Your trade records
   - Track buys/sells, entry/exit prices, P&L
   - Filter by symbol, status, date range

2. **aiForecasts** - AI predictions and forecasts
   - Price, trend, volatility predictions
   - Confidence scores and accuracy tracking
   - Timeframe-based forecasts

3. **marketData** - Historical OHLCV data
   - Open, High, Low, Close, Volume
   - Multiple timeframes (1m, 5m, 1h, 1d)
   - Efficient range queries

4. **tradingStrategies** - Your trading strategies
   - Strategy parameters and settings
   - Performance metrics (win rate, total P&L)
   - Active/inactive status

5. **tradeSignals** - AI-generated trading signals
   - Buy/sell/hold recommendations
   - Price targets, stop loss, take profit
   - Signal strength and reasoning

## Usage Examples

### Import the database
```typescript
import { db } from '@/db';
import { tradeOperations, forecastOperations } from '@/db/operations';
```

### Add a trade
```typescript
await tradeOperations.addTrade({
  symbol: 'BTC/USD',
  tradeType: 'buy',
  entryPrice: 50000,
  quantity: 0.1,
  entryTime: new Date(),
  status: 'open',
  notes: 'Breakout trade'
});
```

### Add an AI forecast
```typescript
await forecastOperations.addForecast({
  symbol: 'BTC/USD',
  forecastType: 'price',
  prediction: {
    targetPrice: 55000,
    probability: 0.75,
    direction: 'up'
  },
  confidenceScore: 85,
  timeframe: '1d',
  modelVersion: 'v1.0',
  forecastTime: new Date(),
  expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
});
```

### Query trades
```typescript
// Get all trades
const allTrades = await tradeOperations.getAllTrades();

// Get open trades
const openTrades = await tradeOperations.getOpenTrades();

// Get trades for specific symbol
const btcTrades = await tradeOperations.getTradesBySymbol('BTC/USD');
```

### Export/Import data
```typescript
// Export all data to JSON
const exportData = await databaseOperations.exportData();
const jsonString = JSON.stringify(exportData);

// Save to file or transfer to another PC
// Then import on new PC:
await databaseOperations.importData(JSON.parse(jsonString));
```

## Data Persistence

Your data is stored in your browser's IndexedDB storage. To transfer data:

1. Export data using `databaseOperations.exportData()`
2. Save the JSON to a file
3. Copy file to new PC
4. Import using `databaseOperations.importData()`

## Browser Storage Limits

- Chrome/Edge: ~60% of available disk space
- Firefox: ~50% of available disk space
- Safari: 1GB limit

The database automatically handles storage efficiently with indexes and optimized queries.
