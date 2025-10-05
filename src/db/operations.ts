import { db, Trade, AIForecast, MarketData, TradingStrategy, TradeSignal } from './index';

export const tradeOperations = {
  async addTrade(trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    return await db.trades.add({
      ...trade,
      createdAt: now,
      updatedAt: now
    });
  },

  async updateTrade(id: string, updates: Partial<Trade>) {
    return await db.trades.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async getTrade(id: string) {
    return await db.trades.get(id);
  },

  async getAllTrades() {
    return await db.trades.toArray();
  },

  async getTradesBySymbol(symbol: string) {
    return await db.trades.where('symbol').equals(symbol).toArray();
  },

  async getOpenTrades() {
    return await db.trades.where('status').equals('open').toArray();
  },

  async deleteTrade(id: string) {
    return await db.trades.delete(id);
  }
};

export const forecastOperations = {
  async addForecast(forecast: Omit<AIForecast, 'id' | 'createdAt'>) {
    return await db.aiForecasts.add({
      ...forecast,
      createdAt: new Date()
    });
  },

  async updateForecast(id: string, updates: Partial<AIForecast>) {
    return await db.aiForecasts.update(id, updates);
  },

  async getForecast(id: string) {
    return await db.aiForecasts.get(id);
  },

  async getAllForecasts() {
    return await db.aiForecasts.toArray();
  },

  async getForecastsBySymbol(symbol: string) {
    return await db.aiForecasts.where('symbol').equals(symbol).toArray();
  },

  async getActiveForecastsBySymbol(symbol: string) {
    const now = new Date();
    return await db.aiForecasts
      .where('symbol')
      .equals(symbol)
      .filter(f => new Date(f.expiryTime) > now)
      .toArray();
  },

  async deleteForecast(id: string) {
    return await db.aiForecasts.delete(id);
  }
};

export const marketDataOperations = {
  async addMarketData(data: Omit<MarketData, 'id' | 'createdAt'>) {
    return await db.marketData.add({
      ...data,
      createdAt: new Date()
    });
  },

  async getMarketData(id: string) {
    return await db.marketData.get(id);
  },

  async getMarketDataBySymbol(symbol: string, timeframe?: string, limit?: number) {
    let query = db.marketData.where('symbol').equals(symbol);

    if (timeframe) {
      query = query.filter(d => d.timeframe === timeframe);
    }

    const data = await query.reverse().sortBy('timestamp');
    return limit ? data.slice(0, limit) : data;
  },

  async getMarketDataRange(symbol: string, startTime: Date, endTime: Date, timeframe?: string) {
    return await db.marketData
      .where('symbol')
      .equals(symbol)
      .filter(d => {
        const timestamp = new Date(d.timestamp);
        const matchesTimeframe = timeframe ? d.timeframe === timeframe : true;
        return timestamp >= startTime && timestamp <= endTime && matchesTimeframe;
      })
      .toArray();
  },

  async deleteMarketData(id: string) {
    return await db.marketData.delete(id);
  },

  async clearOldMarketData(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return await db.marketData
      .where('timestamp')
      .below(cutoffDate)
      .delete();
  }
};

export const strategyOperations = {
  async addStrategy(strategy: Omit<TradingStrategy, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    return await db.tradingStrategies.add({
      ...strategy,
      createdAt: now,
      updatedAt: now
    });
  },

  async updateStrategy(id: string, updates: Partial<TradingStrategy>) {
    return await db.tradingStrategies.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async getStrategy(id: string) {
    return await db.tradingStrategies.get(id);
  },

  async getAllStrategies() {
    return await db.tradingStrategies.toArray();
  },

  async getActiveStrategies() {
    return await db.tradingStrategies.where('isActive').equals(1).toArray();
  },

  async deleteStrategy(id: string) {
    return await db.tradingStrategies.delete(id);
  }
};

export const signalOperations = {
  async addSignal(signal: Omit<TradeSignal, 'id' | 'createdAt'>) {
    return await db.tradeSignals.add({
      ...signal,
      createdAt: new Date()
    });
  },

  async updateSignal(id: string, updates: Partial<TradeSignal>) {
    return await db.tradeSignals.update(id, updates);
  },

  async getSignal(id: string) {
    return await db.tradeSignals.get(id);
  },

  async getAllSignals() {
    return await db.tradeSignals.toArray();
  },

  async getSignalsBySymbol(symbol: string) {
    return await db.tradeSignals.where('symbol').equals(symbol).toArray();
  },

  async getActiveSignals() {
    const now = new Date();
    return await db.tradeSignals
      .filter(s => new Date(s.expiresAt) > now)
      .toArray();
  },

  async getUnactedSignals() {
    const now = new Date();
    return await db.tradeSignals
      .where('actedUpon')
      .equals(0)
      .filter(s => new Date(s.expiresAt) > now)
      .toArray();
  },

  async deleteSignal(id: string) {
    return await db.tradeSignals.delete(id);
  }
};

export const databaseOperations = {
  async exportData() {
    const [trades, forecasts, marketData, strategies, signals] = await Promise.all([
      db.trades.toArray(),
      db.aiForecasts.toArray(),
      db.marketData.toArray(),
      db.tradingStrategies.toArray(),
      db.tradeSignals.toArray()
    ]);

    return {
      trades,
      forecasts,
      marketData,
      strategies,
      signals,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  },

  async importData(data: any) {
    await db.transaction('rw', [
      db.trades,
      db.aiForecasts,
      db.marketData,
      db.tradingStrategies,
      db.tradeSignals
    ], async () => {
      if (data.trades) await db.trades.bulkAdd(data.trades);
      if (data.forecasts) await db.aiForecasts.bulkAdd(data.forecasts);
      if (data.marketData) await db.marketData.bulkAdd(data.marketData);
      if (data.strategies) await db.tradingStrategies.bulkAdd(data.strategies);
      if (data.signals) await db.tradeSignals.bulkAdd(data.signals);
    });
  },

  async clearAllData() {
    await db.transaction('rw', [
      db.trades,
      db.aiForecasts,
      db.marketData,
      db.tradingStrategies,
      db.tradeSignals
    ], async () => {
      await db.trades.clear();
      await db.aiForecasts.clear();
      await db.marketData.clear();
      await db.tradingStrategies.clear();
      await db.tradeSignals.clear();
    });
  }
};
