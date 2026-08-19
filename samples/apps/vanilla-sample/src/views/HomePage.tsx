// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Layout from '../components/Layout';
import useAuth from '../hooks/useAuth';

const HomePage = () => {
    // The raw assertion never reaches the browser, only its decoded (non-secret) claims, via
    // GET /api/session. See src/lib/server/jwt.ts.
    const { assertion } = useAuth();

    return (
        <Layout>
            <Box className="home-container">
                {assertion ? (
                    <Box className="token-container">
                        <Typography variant='h5' sx={{ mb: 3 }}>Decoded Assertion:</Typography>
                        <Box className="decoded-token-container">
                            <Box className="decoded-token-section">
                                <Typography variant='h6' sx={{ mt: 3, mb: 1 }}>Header:</Typography>
                                <pre className="decoded-token">
                                    {JSON.stringify(assertion.header, null, 2)}
                                </pre>
                                <Typography variant='h6' sx={{ mt: 3, mb: 1 }}>Payload:</Typography>
                                <pre className="decoded-token">
                                    {JSON.stringify(assertion.payload, null, 2)}
                                </pre>
                            </Box>
                            <Box className="decoded-token-section" sx={{ mb: 6 }}>
                                <Typography variant='h6' sx={{ mt: 3, mb: 1 }}>Signature:</Typography>
                                <pre className="decoded-token">
                                    <code>{assertion.signature}</code>
                                </pre>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 4 }} />
                        <Typography variant="body2" color="text.secondary">
                            The signed assertion itself stays server-side in an httpOnly cookie.
                            Only these decoded claims are sent to the browser.
                        </Typography>
                    </Box>
                ) : (
                    <Typography>No auth assertion available. Please log in.</Typography>
                )}
            </Box>
        </Layout>
    );
};

export default HomePage;
