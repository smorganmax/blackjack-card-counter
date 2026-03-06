# CLAUDE.md - Project Instructions for Claude Code

## Project Overview
This is a 2-deck blackjack card counting trainer app built as a Progressive Web App (PWA) for iPhone. The app helps users learn the Hi-Lo card counting system while playing realistic blackjack.

## Tech Stack
- React 18+ with Vite
- Tailwind CSS for styling
- PWA with service worker for offline support
- Vitest for testing

## Key Requirements
1. **2-deck shoe** (104 cards) - NOT a single deck or 6/8 deck shoe
2. **Selectable players** (1-7 at the table, not counting dealer)
3. **Hi-Lo counting system** with running count and true count
4. **Mobile-first** - optimized for iPhone Safari (375-430px width)
5. **PWA** - installable on iPhone home screen, works offline

## Development Commands
- npm install - Install dependencies
- npm run dev - Start dev server
- npm run build - Production build
- npm run preview - Preview production build
- npm test - Run tests

## Architecture Notes
- Use React hooks for game state management (useReducer preferred)
- Keep game logic (deck, hand evaluation, counting) in separate utility modules
- Components should be organized by feature (Game, Cards, Controls, Counter, Setup, Stats)
- All card counting logic should be pure functions for easy testing
- Use localStorage for persisting session statistics

## Design Guidelines
- Dark theme with casino green felt background
- Minimum 44px touch targets for all interactive elements
- Card animations for dealing
- Color-coded count display (red = negative, green = positive)
- Support both portrait and landscape orientations
- Handle iPhone safe areas (notch/Dynamic Island)

## Game Rules
- Dealer stands on soft 17
- Blackjack pays 3:2
- Allow: Hit, Stand, Double Down, Split
- Insurance when dealer shows Ace
- Shuffle when ~75% of shoe is dealt

## Card Counting Training
- Track running count using Hi-Lo: 2-6 = +1, 7-9 = 0, 10-A = -1
- Calculate true count = running count / decks remaining
- After each hand, quiz the user on the current running count
- Show accuracy stats over the session
- Optional: show/hide the running count for practice modes
