// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import dynamic from 'next/dynamic';

// Rendered client-only: MUI's emotion styles would otherwise mismatch between server and client
// render passes. See app/layout.tsx for why AuthProvider stays outside this boundary.
const HomeView = dynamic(() => import('./HomeView'), { ssr: false });

export default function Page() {
    return <HomeView />;
}
