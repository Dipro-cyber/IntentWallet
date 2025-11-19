# Intent Wallet - Web3 Pay-Per-Use Gateway

## Overview

This is an advanced cross-chain Web3 wallet and HTTP 402 API gateway built for the Base network. The application enables both human users and AI agents to submit intents (natural language requests like "swap 2 ETH to USDC") which are parsed, priced, and executed after payment. It implements the HTTP 402 Payment Required pattern, allowing users to pay in USDC for each API call or blockchain action on demand.

The system combines intent-based interactions with a pay-per-use model, providing granular access control and instant payment flows. Users connect their wallet (MetaMask/Base), compose intents, receive dynamic pricing, make one-time payments, and unlock access to APIs and on-chain actions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and API caching

**UI Component Library:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component system with Tailwind CSS
- Custom design system based on Material Design + Linear-inspired typography
- Theme support (light/dark mode) with persistent user preference

**Design System:**
- Typography: Inter font family for UI, JetBrains Mono for addresses/hashes
- Spacing primitives: Tailwind units (2, 4, 6, 8, 12, 16, 24)
- Component structure: Sidebar navigation + main content area
- Mobile-responsive grid layout

**State Management:**
- Local component state with React hooks
- TanStack Query for server-side data synchronization
- Wallet state managed at App level and passed down as props

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express
- TypeScript with ESM modules
- Development mode uses tsx for hot reloading

**API Design:**
- RESTful endpoints under `/api/*`
- Intent parsing endpoint: `POST /api/parse-intent`
- Payment processing: `POST /api/process-payment`
- Mock API endpoints for blockchain data (NFT mints, gas prices, whale transactions, etc.)
- HTTP 402 flow: Backend responds with payment required status and dynamic USDC pricing

**Intent Processing System:**
- OpenAI GPT integration for natural language intent parsing (GPT-5 model)
- Fallback to mock parser when OpenAI API key is not configured
- Intent parser maps user requests to specific API endpoints with extracted parameters
- Confidence scoring and estimated pricing returned to client

**Mock API Services:**
- NFT mints tracking
- Gas price oracle
- Whale transaction monitoring
- Token price data
- DEX arbitrage opportunities
- Wallet balance queries
- Token swap execution simulation

### Data Storage Solutions

**Database Technology:**
- PostgreSQL as the primary database
- Drizzle ORM for type-safe database queries
- Neon serverless PostgreSQL for deployment

**Schema Design:**
- `users`: User authentication (username, hashed password)
- `intents`: Parsed user/agent intents with raw text, action, user type, wallet address
- `payments`: Payment records with amount, currency (USDC), transaction hash, confirmations
- `access_records`: Proof of API access with endpoint, parameters, timestamp
- `api_endpoints`: Available API endpoints with paths, descriptions, pricing

**Storage Strategy:**
- In-memory storage implementation (`MemStorage`) for development/testing
- Database-backed storage ready for production (schema defined, migrations configured)
- UUID-based primary keys for all entities
- Timestamp tracking for created/confirmed dates

### Authentication and Authorization

**Wallet-Based Authentication:**
- MetaMask/Web3 wallet connection (eth_requestAccounts)
- No traditional password-based auth required
- Wallet address serves as user identity
- Mock mode available for development without MetaMask

**Authorization Model:**
- Access controlled via payment verification
- Each intent requires payment before API/action execution
- Payment confirmation tracked with blockchain transaction hashes
- Access records created as proof of completed payments

### External Dependencies

**Blockchain Integration:**
- Base network (L2) as primary chain
- Base Sepolia testnet for development
- Ethereum mainnet support configured
- Chain ID detection and network switching
- Block explorer integration (Basescan, Sepolia Basescan, Etherscan)

**Third-Party Services:**
- OpenAI API for intent parsing (GPT-5 model)
- Neon Database for PostgreSQL hosting
- Google Fonts (Inter, JetBrains Mono)

**Payment Processing:**
- USDC as payment currency
- On-chain transaction verification
- Block confirmation tracking
- Transaction hash and block number storage

**Development Tools:**
- Replit-specific plugins for development environment
- Runtime error overlay
- Cartographer for code navigation
- Dev banner for development mode indication

**Deployment Platform:**
- Designed for Vercel deployment (frontend)
- GitHub integration for CI/CD
- Automated build and deployment pipeline