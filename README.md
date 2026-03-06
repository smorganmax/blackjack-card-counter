# Blackjack Card Counter Trainer

A mobile-first Progressive Web App (PWA) for iPhone that simulates 2-deck blackjack and helps you learn Hi-Lo card counting.

## Overview

This app is a **2-deck blackjack card counting trainer** designed to run on iPhone via Safari (as a PWA that can be added to the home screen). It simulates realistic blackjack gameplay with configurable table settings and provides real-time card counting training with feedback.

## Tech Stack

- **Framework:** React (with Vite for build tooling)
- **Styling:** Tailwind CSS for responsive, mobile-first design
- **PWA:** Service worker + manifest for installable iPhone app experience
- **State Management:** React Context or useReducer for game state
- **Testing:** Vitest for unit tests

## Core Features

### Game Setup
- Select number of players at the table (1-7, not counting the dealer)
- User always plays one of the seats
- 2-deck shoe (104 cards) with configurable shuffle point (default: ~75% penetration)
- Standard casino blackjack rules

### Blackjack Gameplay
- Dealer stands on soft 17
- Blackjack pays 3:2
- Player actions: Hit, Stand, Double Down, Split (when applicable)
- Insurance offered when dealer shows Ace
- Proper hand resolution order

### Card Counting Training (Hi-Lo System)
- **Running Count** display (can be toggled on/off for practice)
- **True Count** calculation (running count / decks remaining)
- Cards assigned Hi-Lo values:
  - 2, 3, 4, 5, 6 = +1
  - 7, 8, 9 = 0
  - 10, J, Q, K, A = -1
- After each hand, prompt the user to enter their running count guess
- Show correct/incorrect feedback with the actual count
- Track accuracy percentage over the session
- Visual indicator showing cards remaining in the shoe

### Betting Strategy Training
- Suggest bet sizing based on true count (optional toggle)
- Show recommended plays based on basic strategy
- Deviation alerts when true count warrants strategy changes

### Statistics & Progress
- Session stats: hands played, win/loss/push record
- Count accuracy: percentage of correct count guesses
- Running profit/loss tracker (virtual chips)
- Historical session data stored in localStorage

## UI/UX Requirements

### Mobile-First Design
- Optimized for iPhone screen sizes (375px - 430px width)
- Touch-friendly buttons (minimum 44px tap targets)
- Landscape and portrait orientation support
- Safe area insets for notch/Dynamic Island
- Smooth card dealing animations
- Haptic-style visual feedback on actions

### Visual Design
- Casino green felt table background
- Realistic card faces with clear, readable values
- Clean, modern UI with dark theme
- Clear visual hierarchy: dealer area top, player hands bottom
- Chip stack visualization for bets
- Color-coded count display (red for negative, green for positive)

### PWA Features
- Installable as home screen app on iPhone
- Offline support (works without internet)
- App icon and splash screen
- Full-screen mode (no browser chrome)

## How to Install on iPhone

1. Open the deployed app URL in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm
5. The app will appear on your home screen like a native app

## Card Counting Quick Reference (Hi-Lo)

| Cards | Value |
|-------|-------|
| 2, 3, 4, 5, 6 | +1 |
| 7, 8, 9 | 0 |
| 10, J, Q, K, A | -1 |

**True Count** = Running Count / Decks Remaining

## License

MIT
