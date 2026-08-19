// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import type { 
    PasskeyRequestOptions, 
    PasskeyAssertionResponse 
} from '../services/authService';
import { authenticateWithPasskey } from '../services/authService';

interface PasskeyAuthPromptProps {
    passkeyRequestOptionsJson: string;
    onAuthenticated: (assertion: PasskeyAssertionResponse) => void;
    onError: (error: string) => void;
    isLoading?: boolean;
}

/**
 * PasskeyAuthPrompt component handles passkey authentication via WebAuthn API.
 * It displays a button to authenticate with a passkey and handles the WebAuthn ceremony.
 */
const PasskeyAuthPrompt = ({
    passkeyRequestOptionsJson,
    onAuthenticated,
    onError,
    isLoading = false,
}: PasskeyAuthPromptProps) => {
    const [authenticating, setAuthenticating] = useState(false);

    const handleAuthenticate = async () => {
        setAuthenticating(true);

        try {
            const options: PasskeyRequestOptions = JSON.parse(passkeyRequestOptionsJson);

            const assertion = await authenticateWithPasskey(options);

            onAuthenticated(assertion);
        } catch (err) {
            let displayError: string;
            
            if (err instanceof DOMException) {
                switch (err.name) {
                    case 'NotAllowedError':
                        displayError = 'Passkey authentication was cancelled or not allowed. Please try again.';
                        break;
                    case 'SecurityError':
                        displayError = 'Security error. Please ensure you are on a secure (HTTPS) connection.';
                        break;
                    case 'NotSupportedError':
                        displayError = 'Passkeys are not supported on this device.';
                        break;
                    case 'InvalidStateError':
                        displayError = 'No matching passkey found. Please register a passkey first.';
                        break;
                    default:
                        displayError = err.message || 'Failed to authenticate with passkey';
                }
            } else if (err instanceof Error) {
                displayError = err.message;
            } else {
                displayError = 'Failed to authenticate with passkey';
            }

            onError(displayError);
        } finally {
            setAuthenticating(false);
        }
    };

    const isDisabled = isLoading || authenticating;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                py: 3,
            }}
        >
            <FingerprintIcon sx={{ fontSize: 64, color: 'primary.main' }} />
            
            <Typography variant="h6" textAlign="center">
                Authenticate with Passkey
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
                Use your device's biometric authentication (fingerprint, face, or PIN) to sign in securely.
            </Typography>


            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAuthenticate}
                disabled={isDisabled}
                startIcon={authenticating ? <CircularProgress size={20} color="inherit" /> : <FingerprintIcon />}
                sx={{ mt: 2, minWidth: 200 }}
            >
                {authenticating ? 'Authenticating...' : 'Use Passkey'}
            </Button>
        </Box>
    );
};

export default PasskeyAuthPrompt;
