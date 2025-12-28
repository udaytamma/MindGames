# Changelog

All notable changes to MindGames will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-12-27

### Added
- **Mobile Vertical Layout**: New card-style layout for mobile devices
  - Full equations displayed (e.g., `32 × 3 = ?` instead of just `× 3 = ?`)
  - Problems reveal one at a time as user answers each
  - Answered rows fade to gray with muted styling
  - Active problem row emphasized with primary color
- **Kid Default Profile**: Kid is now the default profile with kid-friendly config
  - Default: 2 chains, 4 chain length
- **Configurable Message Timings**:
  - Final encouragement message (after confetti): 10 seconds
  - Chain completion message: 3 seconds
- **Desktop Encouragement Message**: Now appears at top of chains section
- **Separate Input Refs**: Desktop and mobile layouts now use independent refs

### Fixed
- Mobile layout no longer reveals answers prematurely
- Desktop keyboard input (Tab + typing) works correctly after message changes
- Focus management between desktop and mobile layouts

### Changed
- Minimum chains reduced from 3 to 2
- Profile-based footer messages:
  - Adult: "Mind Games - Practice helps better mental health"
  - Kid: "Mind Games - Practice makes perfect"
- Auto-hide settings panel when Generate is clicked on mobile

## [1.1.1] - 2025-12-28

### Security
- Fixed 3 high severity vulnerabilities in glob dependency
- Updated eslint-config-next from 14.x to 15.x
- Updated eslint from 8.x to 9.x
- Resolved all npm audit warnings

### Changed
- Updated deprecated packages (rimraf, inflight, glob, humanwhocodes)

## [1.1.0] - 2025-12-27

### Added
- **Kid/Adult Profile Mode**: Toggle between Kid and Adult profiles
  - Kid mode shows encouraging messages on chain completion
  - 3-second confetti animation when all chains are completed
  - Kid-friendly completion messages and "Play Again!" button
- **Wide Desktop Layout**: Expanded max-width to 1600px for better use of screen space
- **Left Sidebar**: Profile selection and settings always visible on desktop
- **Mobile Responsiveness**: Settings collapse on mobile, expand on desktop
- **Confetti Integration**: Added `canvas-confetti` library for celebrations
- **Test Suite**: Comprehensive Jest + React Testing Library tests
  - 63 tests across 3 test files
  - Unit tests for problem generator
  - Integration tests for GameContext
  - Component tests for OperationMixSlider
- **JSDoc Documentation**: Added comprehensive documentation to problem-generator module

### Changed
- **Font Sizes**: Increased all font sizes by 10% for better readability
- **Default Preset**: Changed from "Random" (25/25/25/25) to "Basic" (40/40/10/10)
- **Preset Names**: Renamed "Equal" preset to "Random"
- **Preset Buttons**: Made larger with icons and descriptions
- **Preset Selection**: Added visual highlight for selected preset

### Technical
- Added test scripts to package.json (`test`, `test:watch`, `test:coverage`)
- Created jest.config.js and jest.setup.ts
- Version bumped to 1.1.0

## [1.0.0] - 2025-12-27

### Added
- Initial release of MindGames
- **Problem Chain Generation**: Math problems where each answer feeds into the next
- **Four Operations**: Addition, subtraction, multiplication, division
- **Operation Mix Slider**: Configurable percentages for each operation (min 10% each)
- **Preset Modes**: Random, Basic, Advanced, Expert operation mixes
- **Live Mode**: Timed practice sessions with Tab navigation between inputs
- **Chain UI**:
  - Active chain expanded with large inputs
  - Inactive chains collapsed with progress indicators
  - Smooth transitions between states
- **Timer**: Optional countdown timer for sessions
- **Score Tracking**: Real-time correct/incorrect/accuracy display
- **Dark/Light Theme**: Toggle between color modes
- **Session Summary**: End-of-session score display with performance messages
- **Responsive Design**: Works on desktop and mobile devices

### Technical
- Built with Next.js 14 and TypeScript
- Tailwind CSS for styling
- React Context for state management
- Lucide React for icons
