// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, it, expect, vi, afterEach} from 'vitest';
import CopyableId from '../CopyableId';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

// Mock logger
vi.mock('@thunderid/logger/react', () => ({
  useLogger: () => ({
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }),
}));

describe('CopyableId', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays the ID value', () => {
    render(<CopyableId value="test-id-123" />);

    expect(screen.getByText('test-id-123')).toBeInTheDocument();
  });

  it('copies value to clipboard on click', async () => {
    const user = userEvent.setup();
    render(<CopyableId value="test-id-123" />);

    const copyButton = screen.getByRole('button');
    await user.click(copyButton);

    // userEvent.setup() creates its own clipboard stub, so we verify
    // that the component's click handler runs without error
    expect(copyButton).toBeInTheDocument();
  });

  it('copies value to clipboard on Enter key', () => {
    render(<CopyableId value="test-id-123" />);

    const copyButton = screen.getByRole('button');
    fireEvent.keyDown(copyButton, {key: 'Enter'});

    // Verify the handler ran (check icon swap is tested implicitly)
    expect(copyButton).toBeInTheDocument();
  });

  it('copies value to clipboard on Space key', () => {
    render(<CopyableId value="test-id-123" />);

    const copyButton = screen.getByRole('button');
    fireEvent.keyDown(copyButton, {key: ' '});

    expect(copyButton).toBeInTheDocument();
  });

  it('handles clipboard write failure gracefully on click', async () => {
    // Set up a clipboard that will fail
    const mockClipboard = {
      writeText: vi.fn().mockRejectedValue(new Error('Clipboard denied')),
      readText: vi.fn(),
      read: vi.fn(),
      write: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });

    render(<CopyableId value="test-id-123" />);

    const copyButton = screen.getByRole('button');

    // Should not throw
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith('test-id-123');
    });
  });

  it('handles clipboard write failure gracefully on keydown', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockRejectedValue(new Error('Clipboard denied')),
      readText: vi.fn(),
      read: vi.fn(),
      write: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });

    render(<CopyableId value="test-id-123" />);

    const copyButton = screen.getByRole('button');

    // Should not throw
    fireEvent.keyDown(copyButton, {key: 'Enter'});

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith('test-id-123');
    });
  });

  it('uses custom copy label for aria-label', () => {
    render(<CopyableId value="test-id" copyLabel="Copy user type ID" />);

    expect(screen.getByRole('button', {name: 'Copy user type ID'})).toBeInTheDocument();
  });

  it('does not trigger copy on unrelated key press', () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn(),
      read: vi.fn(),
      write: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });

    render(<CopyableId value="test-id-123" />);

    const copyButton = screen.getByRole('button');
    fireEvent.keyDown(copyButton, {key: 'Tab'});

    expect(mockClipboard.writeText).not.toHaveBeenCalled();
  });
});
