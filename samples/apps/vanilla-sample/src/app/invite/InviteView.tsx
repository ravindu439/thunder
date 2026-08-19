// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import ThemeProvider from '../../theme/ThemeProvider';
import InvitePage from '../../views/InvitePage';

export default function InviteView() {
    return (
        <ThemeProvider>
            <InvitePage />
        </ThemeProvider>
    );
}
