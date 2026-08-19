// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@thunderid/test-utils';
import {describe, expect, it, vi, beforeEach} from 'vitest';
import ConfigureName from '../ConfigureName';

vi.mock('@thunderid/utils');

const {generateRandomHumanReadableIdentifiers} = await import('@thunderid/utils');

const mockSuggestions = ['Alpha Service', 'Beta Platform', 'Gamma API', 'Delta Hub', 'Epsilon Suite'];

describe('ConfigureName', () => {
  beforeEach(() => {
    vi.mocked(generateRandomHumanReadableIdentifiers).mockReturnValue(mockSuggestions);
  });

  it('renders the name and identifier input fields', () => {
    render(<ConfigureName name="" identifier="" onNameChange={vi.fn()} onIdentifierChange={vi.fn()} />);

    expect(screen.getByRole('textbox', {name: /resource server name/i})).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /identifier/i})).toBeInTheDocument();
  });

  it('calls onNameChange when name input changes', () => {
    const onNameChange = vi.fn();
    const onIdentifierChange = vi.fn();
    render(<ConfigureName name="" identifier="" onNameChange={onNameChange} onIdentifierChange={onIdentifierChange} />);

    fireEvent.change(screen.getByRole('textbox', {name: /resource server name/i}), {
      target: {value: 'Payments API'},
    });

    expect(onNameChange).toHaveBeenCalledWith('Payments API');
    expect(onIdentifierChange).not.toHaveBeenCalled();
  });

  it('calls onIdentifierChange when the identifier input changes', () => {
    const onIdentifierChange = vi.fn();
    render(<ConfigureName name="Test" identifier="" onNameChange={vi.fn()} onIdentifierChange={onIdentifierChange} />);

    fireEvent.change(screen.getByRole('textbox', {name: /identifier/i}), {
      target: {value: 'https://api.example.com'},
    });

    expect(onIdentifierChange).toHaveBeenCalledWith('https://api.example.com');
  });

  it('calls onReadyChange with true when name and identifier are non-empty', () => {
    const onReadyChange = vi.fn();
    render(
      <ConfigureName
        name="Test"
        identifier="https://api.example.com"
        onNameChange={vi.fn()}
        onIdentifierChange={vi.fn()}
        onReadyChange={onReadyChange}
      />,
    );

    expect(onReadyChange).toHaveBeenCalledWith(true);
  });

  it('calls onReadyChange with false when name is empty', () => {
    const onReadyChange = vi.fn();
    render(
      <ConfigureName
        name=""
        identifier="https://api.example.com"
        onNameChange={vi.fn()}
        onIdentifierChange={vi.fn()}
        onReadyChange={onReadyChange}
      />,
    );

    expect(onReadyChange).toHaveBeenCalledWith(false);
  });

  it('calls onReadyChange with false when identifier is empty', () => {
    const onReadyChange = vi.fn();
    render(
      <ConfigureName
        name="Test"
        identifier=""
        onNameChange={vi.fn()}
        onIdentifierChange={vi.fn()}
        onReadyChange={onReadyChange}
      />,
    );

    expect(onReadyChange).toHaveBeenCalledWith(false);
  });

  it('renders a name suggestion', () => {
    render(<ConfigureName name="" identifier="" onNameChange={vi.fn()} onIdentifierChange={vi.fn()} />);

    expect(screen.getByText('Alpha Service')).toBeInTheDocument();
  });

  it('fills name when the suggestion is clicked', () => {
    const onNameChange = vi.fn();
    const onIdentifierChange = vi.fn();
    render(<ConfigureName name="" identifier="" onNameChange={onNameChange} onIdentifierChange={onIdentifierChange} />);

    fireEvent.click(screen.getByText('Alpha Service'));

    expect(onNameChange).toHaveBeenCalledWith('Alpha Service');
    expect(onIdentifierChange).not.toHaveBeenCalled();
  });

  it('renders the resource server title and label when selectedType is not MCP', () => {
    render(
      <ConfigureName name="" identifier="" selectedType="API" onNameChange={vi.fn()} onIdentifierChange={vi.fn()} />,
    );

    expect(screen.getByText("Let's collect some details about your resource server")).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /resource server name/i})).toBeInTheDocument();
  });

  it('renders the MCP server title and label when selectedType is MCP', () => {
    render(
      <ConfigureName name="" identifier="" selectedType="MCP" onNameChange={vi.fn()} onIdentifierChange={vi.fn()} />,
    );

    expect(screen.getByText("Let's collect some details about your MCP server")).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /mcp server name/i})).toBeInTheDocument();
  });

  it('renders the MCP identifier helper text when selectedType is MCP', () => {
    render(
      <ConfigureName name="" identifier="" selectedType="MCP" onNameChange={vi.fn()} onIdentifierChange={vi.fn()} />,
    );

    expect(
      screen.getByText(
        'A unique identifier for this MCP server. When set as an absolute URI, it becomes the token audience for RFC 8707 resource indicators.',
      ),
    ).toBeInTheDocument();
  });
});

describe('ConfigureName default resource server checkbox', () => {
  beforeEach(() => {
    vi.mocked(generateRandomHumanReadableIdentifiers).mockReturnValue(mockSuggestions);
  });

  const renderWithDefault = (props: Partial<Parameters<typeof ConfigureName>[0]> = {}) =>
    render(
      <ConfigureName
        name="Test"
        identifier="https://api.example.com"
        selectedType="API"
        canSetDefault
        onNameChange={vi.fn()}
        onIdentifierChange={vi.fn()}
        {...props}
      />,
    );

  const defaultCheckbox = () => screen.queryByRole('checkbox', {name: /make this the default resource server/i});

  it('offers the choice for an API resource server', () => {
    renderWithDefault();

    expect(defaultCheckbox()).toBeInTheDocument();
  });

  it('offers the choice for a custom resource server', () => {
    renderWithDefault({selectedType: 'CUSTOM'});

    expect(defaultCheckbox()).not.toBeNull();
  });

  it('does not offer the choice for an MCP server', () => {
    renderWithDefault({selectedType: 'MCP'});

    expect(defaultCheckbox()).toBeNull();
  });

  it('does not offer the choice while the default config is unavailable', () => {
    renderWithDefault({canSetDefault: false});

    expect(defaultCheckbox()).toBeNull();
  });

  it('reflects the ticked state it is given', () => {
    renderWithDefault({makeDefault: true});

    expect(defaultCheckbox()).toBeChecked();
  });

  it('reflects the unticked state it is given', () => {
    renderWithDefault({makeDefault: false});

    expect(defaultCheckbox()).not.toBeChecked();
  });

  it('reports a tick to the caller', () => {
    const onMakeDefaultChange = vi.fn();
    renderWithDefault({makeDefault: false, onMakeDefaultChange});

    fireEvent.click(defaultCheckbox()!);

    expect(onMakeDefaultChange).toHaveBeenCalledWith(true);
  });

  it('reports an untick to the caller', () => {
    const onMakeDefaultChange = vi.fn();
    renderWithDefault({makeDefault: true, onMakeDefaultChange});

    fireEvent.click(defaultCheckbox()!);

    expect(onMakeDefaultChange).toHaveBeenCalledWith(false);
  });
});
