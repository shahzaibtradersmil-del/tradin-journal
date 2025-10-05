import Dexie, { Table } from 'dexie';

export interface Trade {
  id?: string;
  symbol: string;
  tradeType: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  entryTime: Date;
  exitTime?: Date;
  status: 'open' | 'closed' | 'cancelled';
  profitLoss?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIForecast {
  id?: string;
  symbol: string;
  forecastType: 'price' | 'trend' | 'volatility' | 'support_resistance';
  prediction: Record<string, any>;
  confidenceScore: number;
  timeframe: string;
  modelVersion: string;
  forecastTime: Date;
  expiryTime: Date;
  actualOutcome?: Record<string, any>;
  accuracyScore?: number;
  createdAt: Date;
}

export interface MarketData {
  id?: string;
  symbol: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timeframe: string;
  createdAt: Date;
}

export interface TradingStrategy {
  id?: string;
  name: string;
  description?: string;
  parameters: Record<string, any>;
  isActive: boolean;
  totalTrades: number;
  winRate: number;
  totalProfitLoss: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeSignal {
  id?: string;
  symbol: string;
  signalType: 'buy' | 'sell' | 'hold';
  strength: number;
  priceTarget?: number;
  stopLoss?: number;
  takeProfit?: number;
  reasoning?: string;
  strategyId?: string;
  forecastId?: string;
  generatedAt: Date;
  expiresAt: Date;
  actedUpon: boolean;
  createdAt: Date;
}

export class TradingDatabase extends Dexie {
  trades!: Table<Trade>;
  aiForecasts!: Table<AIForecast>;
  marketData!: Table<MarketData>;
  tradingStrategies!: Table<TradingStrategy>;
  tradeSignals!: Table<TradeSignal>;

  constructor() {
    super('TradingDatabase');

    this.version(1).stores({
      trades: '++id, symbol, status, entryTime, tradeType',
      aiForecasts: '++id, symbol, forecastTime, expiryTime, forecastType',
      marketData: '++id, symbol, timestamp, timeframe, [symbol+timestamp]',
      tradingStrategies: '++id, name, isActive',
      tradeSignals: '++id, symbol, generatedAt, actedUpon, signalType'
    });
  }
}

export const db = new TradingDatabase();
