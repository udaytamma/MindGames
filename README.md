# MindGames - Mental Math Training App

A modern mental math training application featuring chain-based problem generation, adaptive difficulty, and gamification elements.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-63%20passed-brightgreen.svg)](tests)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Live Demo:** [https://mindgames.zeroleaf.dev](https://mindgames.zeroleaf.dev)

## Overview

MindGames helps users improve mental math skills through engaging, progressive challenges. Unlike traditional flashcard apps, MindGames uses chain-based problems where each answer feeds into the next calculation, creating a flow state that makes practice enjoyable.

## Features

### Core Gameplay
- **Chain-Based Problems** - Sequential calculations where each result becomes the next operand
- **Four Operations** - Addition, subtraction, multiplication, and division
- **Configurable Mix** - Adjust operation weights with intuitive sliders
- **Real-Time Feedback** - Instant validation with visual indicators

### Difficulty System
- **Kid Mode** - Single-digit numbers, simpler chains, confetti celebrations
- **Adult Mode** - Multi-digit numbers, longer chains, performance tracking
- **Adaptive Difficulty** - Automatic adjustment based on accuracy and speed

### User Experience
- **Dark/Light Mode** - System-aware theme with manual toggle
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Keyboard Support** - Enter to submit, number keys for input
- **Progress Tracking** - Session statistics and streak counters

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14.2 (App Router) |
| **Language** | TypeScript 5.3 |
| **Styling** | Tailwind CSS 3.4 |
| **State** | React Context + useReducer |
| **Testing** | Jest 30.2 + React Testing Library |
| **Deployment** | Cloudflare Pages |

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/udaytamma/MindGames.git
cd MindGames

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start playing.

### Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

## Project Structure

```
MindGames/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with providers
│   │   └── page.tsx              # Main game page
│   ├── components/               # React components
│   │   ├── ChainDisplay.tsx      # Problem chain visualization
│   │   ├── OperationMixSlider.tsx # Operation weight controls
│   │   ├── Timer.tsx             # Session timer
│   │   ├── ScoreDisplay.tsx      # Score and streak
│   │   └── SettingsPanel.tsx     # Game configuration
│   ├── contexts/                 # State management
│   │   ├── GameContext.tsx       # Game state and logic
│   │   └── ThemeContext.tsx      # Theme management
│   ├── lib/                      # Core logic
│   │   ├── problem-generator.ts  # Problem generation algorithms
│   │   └── difficulty-levels.ts  # Difficulty configurations
│   └── __tests__/                # Test files
├── public/                       # Static assets
├── tailwind.config.ts            # Tailwind configuration
└── package.json
```

## Game Mechanics

### Chain Generation

Problems are generated as chains where the result of one calculation becomes an operand in the next:

```
Start: 7
Chain: 7 + 5 = 12 → 12 × 3 = 36 → 36 - 8 = 28 → 28 ÷ 4 = 7
```

### Operation Weights

Users can adjust the probability of each operation:

| Slider | Effect |
|--------|--------|
| Addition | Increase for easier practice |
| Subtraction | Balance with addition |
| Multiplication | Increase for challenge |
| Division | Uses factors for clean results |

### Difficulty Levels

| Mode | Number Range | Chain Length | Features |
|------|--------------|--------------|----------|
| Kid | 1-10 | 3-4 | Confetti, encouragement |
| Adult | 1-100 | 5-8 | Statistics, streaks |

## Configuration

### Theme Customization

Edit `tailwind.config.ts` to customize colors:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      success: '#22c55e',
      error: '#ef4444',
    }
  }
}
```

### Difficulty Tuning

Modify `src/lib/difficulty-levels.ts`:

```typescript
export const difficultyLevels = {
  kid: {
    minNumber: 1,
    maxNumber: 10,
    chainLength: 3,
  },
  adult: {
    minNumber: 1,
    maxNumber: 100,
    chainLength: 6,
  }
};
```

## Deployment

### Cloudflare Pages

```bash
# Build for production
npm run build

# Output in .next directory (or out/ for static export)
```

### Environment Variables

No environment variables required. The app is fully client-side.

## Documentation

- **Architecture**: [zeroleaf.dev/docs/mindgames/architecture](https://zeroleaf.dev/docs/mindgames/architecture)
- **Getting Started**: [zeroleaf.dev/docs/mindgames/getting-started](https://zeroleaf.dev/docs/mindgames/getting-started)
- **Testing**: [zeroleaf.dev/docs/mindgames/testing](https://zeroleaf.dev/docs/mindgames/testing)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-mode`)
3. Commit changes (`git commit -m 'Add timed challenge mode'`)
4. Push to branch (`git push origin feature/new-mode`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Uday Tamma**
- Portfolio: [zeroleaf.dev](https://zeroleaf.dev)
- GitHub: [@udaytamma](https://github.com/udaytamma)

## Acknowledgments

- Inspired by mental math training research
- Built with Claude Code assistance
