// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, within} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {describe, expect, it, vi} from 'vitest';
import ScimAttributeMappingTable from '../ScimAttributeMappingTable';

vi.mock('@thunderid/configure-user-types', () => ({
  useGetUserType: () => ({
    data: {schema: {username: {type: 'string'}, email: {type: 'string'}}},
    isLoading: false,
  }),
}));

function renderWithClient(ui: React.ReactElement): ReturnType<typeof render> {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('ScimAttributeMappingTable', () => {
  it('renders no rows and an enabled add button when value is empty and the schema has no matches', () => {
    renderWithClient(<ScimAttributeMappingTable userTypeId={undefined} value={[]} onChange={vi.fn()} />);
    expect(screen.queryByTestId(/^scim-attribute-mapping-row-/)).not.toBeInTheDocument();
    expect(screen.getByTestId('scim-attribute-mapping-add')).toBeEnabled();
  });

  it('seeds only the catalog fields matching the schema when value is empty', () => {
    const onChange = vi.fn();
    renderWithClient(<ScimAttributeMappingTable userTypeId="type-1" value={[]} onChange={onChange} />);
    expect(onChange).toHaveBeenCalledWith([
      {scimField: 'userName', localAttribute: 'username'},
      {scimField: 'emails', localAttribute: 'email'},
    ]);
  });

  it('renders one row per provided mapping instead of re-seeding', () => {
    renderWithClient(
      <ScimAttributeMappingTable
        userTypeId="type-1"
        value={[{scimField: 'userName', localAttribute: 'my_username'}]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId(/^scim-attribute-mapping-row-/)).toHaveLength(1);
    expect(screen.getByDisplayValue('my_username')).toBeInTheDocument();
  });

  it('appends a pending row when "Add mapping" is clicked', () => {
    const onChange = vi.fn();
    renderWithClient(
      <ScimAttributeMappingTable
        userTypeId="type-1"
        value={[{scimField: 'userName', localAttribute: 'username'}]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('scim-attribute-mapping-add'));
    expect(onChange).toHaveBeenCalledWith([
      {scimField: 'userName', localAttribute: 'username'},
      {scimField: '', localAttribute: ''},
    ]);
  });

  it('disables "Add mapping" while a row has no field selected yet', () => {
    renderWithClient(
      <ScimAttributeMappingTable
        userTypeId="type-1"
        value={[{scimField: '', localAttribute: ''}]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByTestId('scim-attribute-mapping-add')).toBeDisabled();
  });

  it('removes a row when its trash icon is clicked', () => {
    const onChange = vi.fn();
    renderWithClient(
      <ScimAttributeMappingTable
        userTypeId="type-1"
        value={[
          {scimField: 'userName', localAttribute: 'username'},
          {scimField: 'emails', localAttribute: 'email'},
        ]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('scim-attribute-mapping-remove-userName'));
    expect(onChange).toHaveBeenCalledWith([{scimField: 'emails', localAttribute: 'email'}]);
  });

  it("excludes a field already used by another row from a row's SCIM field options", () => {
    renderWithClient(
      <ScimAttributeMappingTable
        userTypeId="type-1"
        value={[
          {scimField: 'userName', localAttribute: 'username'},
          {scimField: '', localAttribute: ''},
        ]}
        onChange={vi.fn()}
      />,
    );
    const pendingRow = screen.getByTestId('scim-attribute-mapping-row-pending');
    fireEvent.mouseDown(within(pendingRow).getByLabelText('SCIM field'));
    expect(screen.queryByRole('option', {name: 'userName'})).not.toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'emails'})).toBeInTheDocument();
  });
});
