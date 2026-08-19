// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import dynamic from 'next/dynamic';

const ProfileView = dynamic(() => import('./ProfileView'), { ssr: false });

export default function Page() {
    return <ProfileView />;
}
