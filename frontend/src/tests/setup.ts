import '@testing-library/jest-dom';

// Mock environment variables
(global as any).import = {
  meta: {
    env: {
      VITE_STRIPE_CLIENT_ID: 'ca_test_12345',
      VITE_API_BASE_URL: 'http://localhost:3000'
    }
  }
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
};

// Mock window.location for URL navigation tests
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
