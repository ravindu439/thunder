// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThemeProvider from '../../theme/ThemeProvider';
import ProfilePage from '../../views/ProfilePage';
import useAuth from '../../hooks/useAuth';

export default function ProfileView() {
    const { isAuthenticated, isInitializing } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            router.replace('/');
        }
    }, [isInitializing, isAuthenticated, router]);

    return (
        <ThemeProvider>
            {isInitializing || !isAuthenticated ? null : <ProfilePage />}
        </ThemeProvider>
    );
}
