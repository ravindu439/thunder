// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';

// Mock ReactDOM
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));
vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

// Mock HOC wrappers as pass-through functions
vi.mock('../hocs/withConfig', () => ({
  default: (Component: React.ComponentType) => Component,
}));
vi.mock('../hocs/withI18n', () => ({
  default: (Component: React.ComponentType) => Component,
}));
vi.mock('../hocs/withTheme', () => ({
  default: (Component: React.ComponentType) => Component,
}));
vi.mock('../App', () => ({
  default: () => <div>App</div>,
}));
vi.mock('../AppWithDecorators', () => ({
  default: () => <div>AppWithDecorators</div>,
}));
vi.mock('@thunderid/utils', () => ({
  setCnPrefix: vi.fn(),
}));

// Mock i18next
vi.mock('i18next', () => ({
  default: {
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  initReactI18next: {},
}));

// Mock i18n
vi.mock('@thunderid/i18n/locales/en-US', () => ({
  default: {
    common: {},
    navigation: {},
    users: {},
    userTypes: {},
    integrations: {},
    applications: {},
    dashboard: {},
    auth: {},
    mfa: {},
    social: {},
    consent: {},
    errors: {},
  },
}));

// Mock contexts
vi.mock('@thunderid/contexts', () => ({
  ConfigProvider: ({children}: {children: React.ReactNode}) => children,
}));

// Mock logger
vi.mock('@thunderid/logger/react', () => ({
  LoggerProvider: ({children}: {children: React.ReactNode}) => children,
  LogLevel: {DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3},
}));

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({children}: {children: React.ReactNode}) => children,
}));

// Mock @tanstack/react-query-devtools
vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}));

// Mock CSS import
vi.mock('../index.css', () => ({}));

describe('main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clean up any existing root element
    const existingRoot = document.getElementById('root');
    if (existingRoot) {
      existingRoot.remove();
    }
    // Create a mock root element
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  });

  afterEach(() => {
    // Clean up the root element
    const root = document.getElementById('root');
    if (root) {
      root.remove();
    }
  });

  it('should have a root element in the document', () => {
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeInTheDocument();
  });

  it('should call createRoot and render when imported', async () => {
    await import('../main');

    await vi.waitFor(() => {
      expect(mockCreateRoot).toHaveBeenCalled();
    });

    expect(mockRender).toHaveBeenCalled();
  });
});
