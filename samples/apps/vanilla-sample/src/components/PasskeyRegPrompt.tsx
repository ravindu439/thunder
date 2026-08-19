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
    PasskeyCreationOptions, 
    PasskeyCredentialResponse 
} from '../services/authService';
import { createPasskeyCredential } from '../services/authService';

interface PasskeyRegPromptProps {
    passkeyCreationOptionsJson: string;
    onCredentialCreated: (credential: PasskeyCredentialResponse) => void;
    onError: (error: string) => void;
    isLoading?: boolean;
}

/**
 * PasskeyRegPrompt component handles passkey credential creation via WebAuthn API.
 * It displays a button to create a passkey and handles the WebAuthn ceremony.
 */
const PasskeyRegPrompt = ({
    passkeyCreationOptionsJson,
    onCredentialCreated,
    onError,
    isLoading = false,
}: PasskeyRegPromptProps) => {
    const [creating, setCreating] = useState(false);

    const handleCreatePasskey = async () => {
        setCreating(true);

        try {
            const options: PasskeyCreationOptions = JSON.parse(passkeyCreationOptionsJson);
            const credential = await createPasskeyCredential(options);
            onCredentialCreated(credential);
        } catch (err) {
            let displayError: string;
            
            if (err instanceof DOMException) {
                switch (err.name) {
                    case 'NotAllowedError':
                        displayError = 'Passkey creation was cancelled or not allowed. Please try again.';
                        break;
                    case 'SecurityError':
                        displayError = 'Security error. Please ensure you are on a secure (HTTPS) connection.';
                        break;
                    case 'NotSupportedError':
                        displayError = 'Passkeys are not supported on this device.';
                        break;
                    default:
                        displayError = err.message || 'Failed to create passkey';
                }
            } else if (err instanceof Error) {
                displayError = err.message;
            } else {
                displayError = 'Failed to create passkey';
            }

            onError(displayError);
        } finally {
            setCreating(false);
        }
    };

    const isDisabled = isLoading || creating;

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
                Create a Passkey
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
                Use your device's biometric authentication (fingerprint, face, or PIN) to create a secure passkey.
            </Typography>


            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCreatePasskey}
                disabled={isDisabled}
                startIcon={creating ? <CircularProgress size={20} color="inherit" /> : <FingerprintIcon />}
                sx={{ mt: 2, minWidth: 200 }}
            >
                {creating ? 'Creating Passkey...' : 'Create Passkey'}
            </Button>
        </Box>
    );
};

export default PasskeyRegPrompt;
