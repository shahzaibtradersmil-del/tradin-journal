/*
  # Trade Data and AI Forecasts Database Schema

  ## Overview
  This migration creates a comprehensive database for storing offline trading data
  with AI forecast capabilities.

  ## New Tables

  ### 1. `trades`
  Stores individual trade records
  - `id` (uuid, primary key)
  - `symbol` (text) - Trading pair/ticker symbol
  - `trade_type` (text) - 'buy' or 'sell'
  - `entry_price` (decimal) - Price at entry
  - `exit_price` (decimal) - Price at exit (nullable for open trades)
  - `quantity` (decimal) - Amount traded
  - `entry_time` (timestamptz) - When trade was opened
  - `exit_time` (timestamptz) - When trade was closed (nullable)
  - `status` (text) - 'open', 'closed', 'cancelled'
  - `profit_loss` (decimal) - Calculated P&L (nullable)
  - `notes` (text) - User notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `ai_forecasts`
  Stores AI-generated market forecasts
  - `id` (uuid, primary key)
  - `symbol` (text) - Trading pair/ticker symbol
  - `forecast_type` (text) - Type of forecast (price, trend, volatility)
  - `prediction` (jsonb) - Forecast data (price targets, probabilities, etc.)
  - `confidence_score` (decimal) - AI confidence level (0-100)
  - `timeframe` (text) - Forecast timeframe (1h, 4h, 1d, 1w, etc.)
  - `model_version` (text) - AI model identifier
  - `forecast_time` (timestamptz) - When forecast was generated
  - `expiry_time` (timestamptz) - When forecast expires
  - `actual_outcome` (jsonb) - Actual market outcome (nullable)
  - `accuracy_score` (decimal) - Forecast accuracy (nullable)
  - `created_at` (timestamptz)

  ### 3. `market_data`
  Stores historical market data for analysis
  - `id` (uuid, primary key)
  - `symbol` (text) - Trading pair/ticker symbol
  - `timestamp` (timestamptz) - Data point timestamp
  - `open` (decimal) - Opening price
  - `high` (decimal) - High price
  - `low` (decimal) - Low price
  - `close` (decimal) - Closing price
  - `volume` (decimal) - Trading volume
  - `timeframe` (text) - Data timeframe (1m, 5m, 1h, 1d)
  - `created_at` (timestamptz)

  ### 4. `trading_strategies`
  Stores trading strategies and their performance
  - `id` (uuid, primary key)
  - `name` (text) - Strategy name
  - `description` (text) - Strategy description
  - `parameters` (jsonb) - Strategy parameters
  - `is_active` (boolean) - Whether strategy is active
  - `total_trades` (integer) - Total trades executed
  - `win_rate` (decimal) - Win rate percentage
  - `total_profit_loss` (decimal) - Total P&L
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `trade_signals`
  Stores AI-generated trading signals
  - `id` (uuid, primary key)
  - `symbol` (text) - Trading pair/ticker symbol
  - `signal_type` (text) - 'buy', 'sell', 'hold'
  - `strength` (decimal) - Signal strength (0-100)
  - `price_target` (decimal) - Suggested price target
  - `stop_loss` (decimal) - Suggested stop loss
  - `take_profit` (decimal) - Suggested take profit
  - `reasoning` (text) - AI reasoning for signal
  - `strategy_id` (uuid) - Link to strategy (nullable)
  - `forecast_id` (uuid) - Link to forecast (nullable)
  - `generated_at` (timestamptz)
  - `expires_at` (timestamptz)
  - `acted_upon` (boolean) - Whether signal was used
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - All tables are accessible without authentication for offline use
  - Policies allow full access for local/offline operations

  ## Indexes
  - Performance indexes on frequently queried columns
*/

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  trade_type text NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  entry_price decimal(20, 8) NOT NULL,
  exit_price decimal(20, 8),
  quantity decimal(20, 8) NOT NULL,
  entry_time timestamptz NOT NULL,
  exit_time timestamptz,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  profit_loss decimal(20, 8),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_forecasts table
CREATE TABLE IF NOT EXISTS ai_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  forecast_type text NOT NULL CHECK (forecast_type IN ('price', 'trend', 'volatility', 'support_resistance')),
  prediction jsonb NOT NULL,
  confidence_score decimal(5, 2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  timeframe text NOT NULL,
  model_version text NOT NULL,
  forecast_time timestamptz NOT NULL DEFAULT now(),
  expiry_time timestamptz NOT NULL,
  actual_outcome jsonb,
  accuracy_score decimal(5, 2) CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create market_data table
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  timestamp timestamptz NOT NULL,
  open decimal(20, 8) NOT NULL,
  high decimal(20, 8) NOT NULL,
  low decimal(20, 8) NOT NULL,
  close decimal(20, 8) NOT NULL,
  volume decimal(20, 8) NOT NULL DEFAULT 0,
  timeframe text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create trading_strategies table
CREATE TABLE IF NOT EXISTS trading_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  parameters jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  total_trades integer DEFAULT 0,
  win_rate decimal(5, 2) DEFAULT 0,
  total_profit_loss decimal(20, 8) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trade_signals table
CREATE TABLE IF NOT EXISTS trade_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('buy', 'sell', 'hold')),
  strength decimal(5, 2) NOT NULL CHECK (strength >= 0 AND strength <= 100),
  price_target decimal(20, 8),
  stop_loss decimal(20, 8),
  take_profit decimal(20, 8),
  reasoning text DEFAULT '',
  strategy_id uuid REFERENCES trading_strategies(id) ON DELETE SET NULL,
  forecast_id uuid REFERENCES ai_forecasts(id) ON DELETE SET NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  acted_upon boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_entry_time ON trades(entry_time);

CREATE INDEX IF NOT EXISTS idx_ai_forecasts_symbol ON ai_forecasts(symbol);
CREATE INDEX IF NOT EXISTS idx_ai_forecasts_forecast_time ON ai_forecasts(forecast_time);
CREATE INDEX IF NOT EXISTS idx_ai_forecasts_expiry ON ai_forecasts(expiry_time);

CREATE INDEX IF NOT EXISTS idx_market_data_symbol_timestamp ON market_data(symbol, timestamp);
CREATE INDEX IF NOT EXISTS idx_market_data_timeframe ON market_data(timeframe);

CREATE INDEX IF NOT EXISTS idx_trade_signals_symbol ON trade_signals(symbol);
CREATE INDEX IF NOT EXISTS idx_trade_signals_generated_at ON trade_signals(generated_at);
CREATE INDEX IF NOT EXISTS idx_trade_signals_acted_upon ON trade_signals(acted_upon);

-- Enable Row Level Security
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_signals ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for offline/local use (no authentication required)
CREATE POLICY "Allow all operations on trades"
  ON trades
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on ai_forecasts"
  ON ai_forecasts
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on market_data"
  ON market_data
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on trading_strategies"
  ON trading_strategies
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on trade_signals"
  ON trade_signals
  FOR ALL
  USING (true)
  WITH CHECK (true);
