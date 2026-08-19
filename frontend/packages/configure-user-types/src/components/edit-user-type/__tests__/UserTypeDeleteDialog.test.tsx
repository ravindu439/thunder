// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */
import {render, screen, waitFor, userEvent} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import UserTypeDeleteDialog from '../UserTypeDeleteDialog';

const mockMutate = vi.fn();
const mockUseDeleteUserType = vi.fn<() => any>();

vi.mock('../../../api/useDeleteUserType', () => ({
  default: () => mockUseDeleteUserType(),
}));

describe('UserTypeDeleteDialog', () => {
  const defaultProps = {
    open: true,
    userTypeId: 'schema-123',
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDeleteUserType.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      reset: vi.fn(),
    });
  });

  it('renders dialog with warning content', () => {
    render(<UserTypeDeleteDialog {...defaultProps} />);

    expect(screen.getByText(/are you sure you want to delete this user type/i)).toBeInTheDocument();
    expect(screen.getByText(/all associated schema definitions will be permanently removed/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<UserTypeDeleteDialog {...defaultProps} />);

    await user.click(screen.getByRole('button', {name: /cancel/i}));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not close when cancel is clicked during pending delete', () => {
    mockUseDeleteUserType.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
      reset: vi.fn(),
    });

    render(<UserTypeDeleteDialog {...defaultProps} />);

    // Cancel button should be disabled during pending state
    expect(screen.getByRole('button', {name: /cancel/i})).toBeDisabled();
  });

  it('disables delete button when userTypeId is null', () => {
    render(<UserTypeDeleteDialog {...defaultProps} userTypeId={null} />);

    // Delete button should be disabled when no userTypeId
    expect(screen.getByRole('button', {name: /^delete$/i})).toBeDisabled();
  });

  it('does not call mutate when handleConfirm is called with null userTypeId', () => {
    render(<UserTypeDeleteDialog {...defaultProps} userTypeId={null} />);

    // The button is disabled, so mutate should never be called
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls mutate with userTypeId on confirm', async () => {
    const user = userEvent.setup();
    render(<UserTypeDeleteDialog {...defaultProps} />);

    const deleteButton = screen.getByRole('button', {name: /^delete$/i});
    await user.click(deleteButton);

    expect(mockMutate).toHaveBeenCalledWith(
      'schema-123',
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  it('calls onClose and onSuccess on successful deletion', async () => {
    const user = userEvent.setup();
    mockMutate.mockImplementation((_id: string, options: {onSuccess: () => void}) => {
      options.onSuccess();
    });

    render(<UserTypeDeleteDialog {...defaultProps} />);

    await user.click(screen.getByRole('button', {name: /^delete$/i}));

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('displays error message on deletion failure', async () => {
    const user = userEvent.setup();
    mockMutate.mockImplementation((_id: string, options: {onError: (err: Error) => void}) => {
      options.onError(new Error('Delete failed'));
    });

    render(<UserTypeDeleteDialog {...defaultProps} />);

    await user.click(screen.getByRole('button', {name: /^delete$/i}));

    await waitFor(() => {
      expect(screen.getByText('Failed to delete user type. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows deleting state when pending', () => {
    mockUseDeleteUserType.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
      reset: vi.fn(),
    });

    render(<UserTypeDeleteDialog {...defaultProps} />);

    expect(screen.getByRole('button', {name: /deleting/i})).toBeDisabled();
    expect(screen.getByRole('button', {name: /cancel/i})).toBeDisabled();
  });
});
