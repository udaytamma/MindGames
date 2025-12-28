import '@testing-library/jest-dom';

// Mock canvas-confetti
jest.mock('canvas-confetti', () => {
  return jest.fn();
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}));
