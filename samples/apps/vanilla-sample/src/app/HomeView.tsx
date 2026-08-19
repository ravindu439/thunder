// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import ThemeProvider from '../theme/ThemeProvider';
import HomePage from '../views/HomePage';
import LoginPage from '../views/LoginPage';
import useAuth from '../hooks/useAuth';

export default function HomeView() {
    const { isAuthenticated, isInitializing } = useAuth();

    return (
        <ThemeProvider>
            {isInitializing ? null : isAuthenticated ? <HomePage /> : <LoginPage />}
        </ThemeProvider>
    );
}
