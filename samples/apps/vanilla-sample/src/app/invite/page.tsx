// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import dynamic from 'next/dynamic';

const InviteView = dynamic(() => import('./InviteView'), { ssr: false });

export default function Page() {
    return <InviteView />;
}
