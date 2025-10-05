# Trading Journal - Professional Trading Analytics

## Overview

A professional, AI-powered trading journal application built with React, TypeScript, and modern web technologies. The application enables traders to track, analyze, and visualize their trading performance with intelligent AI insights powered by Google Gemini. Features include AI trade summaries, pattern analysis, daily journal prompts, auto-tagging, risk evaluation, advanced analytics, equity curves, session analysis, instrument performance tracking, PDF/CSV export, and comprehensive reporting capabilities.

**Recent Updates (October 2025)**:
- Redesigned UI with modern glassmorphism aesthetic and gradient accents
- Implemented complete trade entry form with instrument selection, date/time, position types, lot sizing
- Added database persistence with Dexie.js for offline-first functionality
- Integrated PDF and CSV export functionality for trade reports
- Enhanced visual hierarchy with blue-indigo-slate color palette

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Framework**: React 18 with TypeScript, utilizing Vite as the build tool for fast development and optimized production builds.

**UI Component System**: Built on shadcn/ui components with Radix UI primitives, providing accessible and customizable interface elements. Tailwind CSS powers the styling system with a custom design token architecture defined in HSL color space.

**State Management**: 
- React Query (@tanstack/react-query) handles server state and caching
- React hooks manage local component state
- Form state managed through react-hook-form with Zod validation via @hookform/resolvers

**Routing**: React Router v6 provides client-side routing with a catch-all 404 handler

**Animation**: Framer Motion delivers smooth animations and transitions throughout the UI, with canvas-confetti for celebration effects

**Theme System**: Custom light/dark mode implementation with localStorage persistence and system preference detection

### Data Storage Architecture

**Offline-First Database**: Dexie.js (IndexedDB wrapper) provides local-first data storage, enabling full offline functionality. The application uses dexie-react-hooks for reactive database queries.

**Database Schema**:
- Trades table with indexed fields: id, instrument, dateTime, tags, createdAt, tradeType, positionType
- Version 2 migration adds support for trade types (live/backtest) and position types (long/short)
- All data persists locally in the browser

**Trade Data Model**: Comprehensive trade tracking including:
- Entry/exit prices, stop loss, position sizing
- Lot size calculations (standard, mini, micro, nano)
- Profit/loss and R-multiple calculations
- Trading session detection (Asian, London, New York, overlaps)
- Image attachments and notes
- Tagging system for categorization

### Key Architectural Patterns

**Component Composition**: Modular component design with separation of concerns:
- Presentational components (UI elements)
- Container components (data and logic)
- Custom hooks for shared logic
- Glass morphism design pattern for visual hierarchy

**Calculation Engine**: Centralized calculation utilities handle:
- Profit/loss calculations for various instruments (Forex, Metals, Indices)
- R-multiple and risk/reward metrics
- Win rate, expectancy, and profit factor
- Session-based performance analytics
- Instrument-specific pip value calculations

**Trading Analytics**: Advanced statistics module providing:
- Win/loss streaks tracking
- Monthly performance aggregation
- Session-based performance analysis
- Instrument performance rankings
- Equity curve generation

**Form Management**: Dual-purpose forms for trade creation and editing with:
- Real-time validation
- Image upload with drag-and-drop
- Dynamic lot size calculations
- Automatic session detection based on trade time

### Data Flow Architecture

**Unidirectional Data Flow**:
1. User interactions trigger actions
2. Actions update Dexie database
3. Database changes trigger reactive queries via dexie-react-hooks
4. Components re-render with updated data

**Date Range Filtering**: Centralized filtering logic applied at query time, allowing all analytics components to respect user-selected date ranges without prop drilling.

**Export Functionality**: Print-to-PDF export system with formatted reports including statistics, trade lists, and performance metrics.

## External Dependencies

### UI Libraries
- **Radix UI**: Comprehensive set of accessible component primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library

### Data & State Management
- **Dexie.js**: IndexedDB wrapper for offline data storage
- **dexie-react-hooks**: React integration for Dexie with reactive queries
- **TanStack Query (React Query)**: Server state management and caching
- **react-hook-form**: Form state management
- **Zod** (via @hookform/resolvers): Schema validation

### Utilities
- **date-fns**: Date manipulation and formatting
- **canvas-confetti**: Celebration animations
- **recharts**: Charting library for equity curves and analytics
- **cmdk**: Command palette component
- **class-variance-authority**: CSS variant management
- **clsx & tailwind-merge**: Conditional class name utilities
- **@google/genai**: Google Gemini AI integration for intelligent trade analysis
- **sonner**: Toast notifications

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **ESLint**: Code linting with React-specific rules
- **PostCSS & Autoprefixer**: CSS processing

### Trading-Specific Logic
- Custom instrument definitions (Forex pairs, Metals, Indices)
- Lot size calculation utilities
- Trading session detection based on UTC time
- Multi-currency pip value calculations
- R-multiple and expectancy formulas

### AI-Powered Features (October 2025)

**Google Gemini Integration**: The application now includes 5 AI-powered features using Google's Gemini API:

1. **AI Trade Summary Generator**: After logging a trade, generates a concise, constructive reflection analyzing entry/exit quality, risk management, and emotional discipline. Provides actionable improvement suggestions.

2. **AI Pattern Insight**: Analyzes the last 10 trades to identify performance patterns, including:
   - Time-of-day performance trends
   - Setup type success rates
   - Win/loss streaks
   - Risk management quality
   
3. **AI Journal Prompts**: Generates daily thoughtful reflection questions focusing on emotional state, trading discipline, performance growth, and risk management.

4. **AI Trade Tagging Assistant**: Automatically suggests up to 3 relevant tags based on trade notes and descriptions (e.g., breakout, trend-following, fomo, disciplined, etc.).

5. **AI Risk Evaluation Assistant**: Before submitting a trade, evaluates the risk-to-reward ratio and provides specific feedback on stop placement and target selection.

**Environment Setup**: Requires `VITE_GOOGLE_API_KEY` environment variable with a valid Google Gemini API key. Template available in `.env.example`.

**Note**: The application is fully client-side with no backend requirements. All data persists in the browser's IndexedDB, making it truly offline-capable. AI features require an internet connection to communicate with Google's Gemini API.