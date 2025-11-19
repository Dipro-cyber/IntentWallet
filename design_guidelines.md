# Design Guidelines: Advanced Web3 Intent Wallet & HTTP 402 API Gateway

## Design Approach
**Hybrid System**: Material Design foundation for data-heavy components + Linear-inspired typography precision + Web3 design patterns from Uniswap/MetaMask. This is a utility-first interface prioritizing clarity, trust, and efficient task completion for both human users and AI agents.

## Typography System

**Font Families** (via Google Fonts):
- Primary: Inter (400, 500, 600, 700) - UI elements, body text, data
- Monospace: JetBrains Mono (400, 500) - addresses, transaction hashes, code

**Hierarchy**:
- H1: text-4xl font-bold tracking-tight (Dashboard titles)
- H2: text-2xl font-semibold (Section headers)
- H3: text-lg font-semibold (Card titles, panel headers)
- Body: text-base font-normal (Default text)
- Small: text-sm (Secondary info, timestamps)
- Tiny: text-xs (Labels, captions)
- Mono: font-mono text-sm (Wallet addresses, hashes, amounts)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 (cards), p-8 (panels)
- Section gaps: space-y-8 (vertical stacking)
- Grid gaps: gap-6 (card grids)
- Element margins: mb-2, mb-4, mb-6

**Grid Structure**:
- Dashboard: Two-column layout (lg:grid-cols-12) - sidebar (col-span-3) + main (col-span-9)
- Content area: max-w-7xl mx-auto px-6
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Component Library

### Navigation & Layout
**Sidebar Navigation** (Persistent):
- Fixed left sidebar, w-64, full height
- Logo at top with network indicator badge
- Vertical nav items with icons (Heroicons)
- Wallet connection status at bottom
- Current network display with chain icon

**Top Bar**:
- Breadcrumb navigation (left)
- Wallet address display with copy button (right)
- Balance display (ETH + USDC)
- Network switcher dropdown

### Core Dashboard Components

**Intent Composer** (Primary Feature):
- Large text input area (min-h-32) with placeholder examples
- Intent suggestion chips below input
- Parse button (prominent, right-aligned)
- Real-time validation feedback
- Example intents displayed as clickable templates

**Payment Dialog** (HTTP 402 Modal):
- Centered modal (max-w-lg)
- Clear pricing display with USDC amount (text-3xl font-bold)
- API endpoint description
- One-click payment button (w-full, large)
- Transaction status progress indicator
- Cancel option (text link, subtle)

**Transaction Confirmation Panel**:
- Step indicator (1/3, 2/3, 3/3 with visual progress)
- Transaction details in key-value pairs
- Gas estimation display
- Confirm/Reject buttons (side-by-side, equal width)
- Loading state with spinner during blockchain confirmation

**Access History Table**:
- Dense data table with fixed header
- Columns: Timestamp, Intent, Endpoint, Amount, Status
- Status badges (pill-shaped, small)
- Pagination controls at bottom
- Search/filter bar above table

**Analytics Dashboard Cards**:
- Grid of stat cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Each card: Large number (text-3xl), label (text-sm), trend indicator
- Charts using simple bar/line visualizations
- Real-time update indicators (small pulse animation)

### Form Elements

**Input Fields**:
- Consistent height (h-12)
- Border with focus ring
- Label above (text-sm font-medium mb-2)
- Helper text below (text-xs)
- Error states with inline validation messages

**Buttons**:
- Primary: px-6 py-3, font-semibold, rounded-lg
- Secondary: Same size, different treatment
- Icon buttons: w-10 h-10, rounded-lg, centered icon
- Disabled states clearly distinguishable

### Web3-Specific Components

**Wallet Connection Button**:
- Prominent in header when disconnected
- Shows truncated address when connected (0x1234...5678)
- Dropdown on click: Full address, Copy, Disconnect options

**Network Badge**:
- Small pill indicator
- Chain name + icon
- Position: Top-right of cards or header

**Transaction Hash Display**:
- Monospace font
- Truncated with ellipsis in middle
- Copy button adjacent
- External link icon to block explorer

**Agent vs Human Toggle**:
- Tab-style switcher at top of intent composer
- Clear visual distinction between modes
- Different placeholder text and examples per mode

### Data Visualization

**Live Status Indicators**:
- Small dots with pulse animation for "live" state
- Clear pending/success/failed states with icons
- Timestamp displays (relative: "2 min ago")

**Payment Proof Cards**:
- Compact card showing on-chain proof
- Transaction hash link
- Block number and confirmation count
- Verification checkmark icon

## Responsive Behavior

**Mobile (< 768px)**:
- Sidebar collapses to hamburger menu
- Single-column layouts throughout
- Bottom navigation bar for key actions
- Simplified intent composer (smaller text area)

**Tablet (768px - 1024px)**:
- Two-column grids for stat cards
- Sidebar persistent or slide-over
- Full-width transaction tables

**Desktop (> 1024px)**:
- Full sidebar always visible
- Three-column grids for analytics
- Multi-panel layouts with optimal spacing

## Accessibility Standards

- All interactive elements: min-h-11, clear focus states
- Form labels always present (not placeholder-only)
- ARIA labels for wallet addresses, transaction hashes
- Keyboard navigation for all critical flows
- Loading states announced to screen readers
- Error messages programmatically associated with inputs

## Critical UX Flows

**Intent to Payment Flow**:
1. User enters intent → immediate parsing feedback
2. Parsed action displays → clear pricing shown
3. HTTP 402 modal appears → one-click payment
4. Transaction confirmation → real-time status updates
5. Success screen → access granted with proof

**Layout Principle**: Information density with breathing room. Pack data efficiently while maintaining clear visual hierarchy through spacing and typography weight, not excessive whitespace.