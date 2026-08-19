// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from 'next';
import AuthProvider from '../contexts/AuthProvider';
import '../index.css';
import '../App.css';

export const metadata: Metadata = {
    title: 'ThunderID Vanilla Sample',
    description: 'App-native flow orchestration with ThunderID, kept server-side.',
};

// AuthProvider holds no MUI/CSS-in-JS, so it's safe to mount here and share across every route.
// The MUI theme and page content render client-only (see app/*/View.tsx) to avoid an SSR/CSR
// emotion class-name mismatch.
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
