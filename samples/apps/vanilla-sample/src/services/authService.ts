// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Same-origin route that proxies POST /flow/execute. The server pins the applicationId and
// attaches the Flow Secret on initiation, so the browser never needs either.
const FLOW_API_PATH = '/api/flow';

export const NativeAuthSubmitType = {
    INPUT: 'INPUT',
    SOCIAL: 'SOCIAL',
    OTP: 'OTP',
} as const;

export type NativeAuthSubmitType = (typeof NativeAuthSubmitType)[keyof typeof NativeAuthSubmitType];

// WebAuthn/Passkey helper types
export interface PasskeyCreationOptions {
    challenge: string;
    rp: {
        name: string;
        id: string;
    };
    user: {
        name: string;
        displayName: string;
        id: string;
    };
    pubKeyCredParams: Array<{
        type: string;
        alg: number;
    }>;
    authenticatorSelection?: {
        authenticatorAttachment?: string;
        residentKey?: string;
        userVerification?: string;
    };
    timeout?: number;
    attestation?: string;
}

/**
 * Response data from passkey credential creation (registration).
 * Contains the encoded credential data to be sent to the server for verification.
 */
export interface PasskeyCredentialResponse {
    credentialId: string;
    clientDataJSON: string;
    attestationObject: string;
}

/**
 * Converts an ArrayBuffer to a base64url-encoded string.
 * This is the standard encoding for WebAuthn data.
 * 
 * @param {ArrayBuffer} buffer - The buffer to encode.
 * @returns {string} - The base64url-encoded string.
 */
export const bufferToBase64Url = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

/**
 * Converts a base64url-encoded string to an ArrayBuffer.
 * 
 * @param {string} base64url - The base64url string to decode.
 * @returns {ArrayBuffer} - The decoded ArrayBuffer.
 */
export const base64UrlToBuffer = (base64url: string): ArrayBuffer => {
    const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
    const base64 = (base64url + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
};

/**
 * Creates a passkey credential using the WebAuthn API.
 * 
 * @param {PasskeyCreationOptions} options - The passkey creation options from the server.
 * @returns {Promise<PasskeyCredentialResponse>} - The encoded credential response.
 */
export const createPasskeyCredential = async (
    options: PasskeyCreationOptions
): Promise<PasskeyCredentialResponse> => {
    // Convert base64url-encoded challenge and user.id to ArrayBuffer
    const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge: base64UrlToBuffer(options.challenge),
        rp: options.rp,
        user: {
            name: options.user.name,
            displayName: options.user.displayName,
            id: base64UrlToBuffer(options.user.id),
        },
        pubKeyCredParams: options.pubKeyCredParams.map(param => ({
            type: param.type as PublicKeyCredentialType,
            alg: param.alg,
        })),
        authenticatorSelection: options.authenticatorSelection ? {
            authenticatorAttachment: options.authenticatorSelection.authenticatorAttachment as AuthenticatorAttachment | undefined,
            residentKey: options.authenticatorSelection.residentKey as ResidentKeyRequirement | undefined,
            userVerification: options.authenticatorSelection.userVerification as UserVerificationRequirement | undefined,
        } : undefined,
        timeout: options.timeout,
        attestation: options.attestation as AttestationConveyancePreference | undefined,
    };

    // Call WebAuthn API
    const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
    }) as PublicKeyCredential | null;

    // Check if credential creation was successful
    if (!credential) {
        throw new Error('Passkey creation was cancelled or failed. No credential was returned.');
    }

    const response = credential.response as AuthenticatorAttestationResponse;

    // Encode the response data as base64url strings
    return {
        credentialId: credential.id,
        clientDataJSON: bufferToBase64Url(response.clientDataJSON),
        attestationObject: bufferToBase64Url(response.attestationObject),
    };
};

// Passkey Authentication (Assertion) types
export interface PasskeyRequestOptions {
    challenge: string;
    rpId: string;
    allowCredentials?: Array<{
        type: string;
        id: string;
    }>;
    userVerification?: string;
    timeout?: number;
}

/**
 * Response data from passkey authentication (assertion).
 * Contains the encoded assertion data to be sent to the server for verification.
 */
export interface PasskeyAssertionResponse {
    credentialId: string;
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle: string;
}

/**
 * Authenticates with a passkey using the WebAuthn API (assertion/get).
 * 
 * @param {PasskeyRequestOptions} options - The passkey request options from the server.
 * @returns {Promise<PasskeyAssertionResponse>} - The encoded assertion response.
 */
export const authenticateWithPasskey = async (
    options: PasskeyRequestOptions
): Promise<PasskeyAssertionResponse> => {
    // Convert base64url-encoded values to ArrayBuffer
    const publicKeyOptions: PublicKeyCredentialRequestOptions = {
        challenge: base64UrlToBuffer(options.challenge),
        rpId: options.rpId,
        allowCredentials: options.allowCredentials?.map(cred => ({
            type: cred.type as PublicKeyCredentialType,
            id: base64UrlToBuffer(cred.id),
        })),
        userVerification: options.userVerification as UserVerificationRequirement | undefined,
        timeout: options.timeout,
    };

    // Call WebAuthn API for assertion
    const credential = await navigator.credentials.get({
        publicKey: publicKeyOptions,
    }) as PublicKeyCredential | null;

    // Check if credential retrieval was successful
    if (!credential) {
        throw new Error('Passkey authentication was cancelled or failed. No credential was returned.');
    }

    const response = credential.response as AuthenticatorAssertionResponse;

    // Encode the response data as base64url strings
    return {
        credentialId: credential.id,
        clientDataJSON: bufferToBase64Url(response.clientDataJSON),
        authenticatorData: bufferToBase64Url(response.authenticatorData),
        signature: bufferToBase64Url(response.signature),
        userHandle: response.userHandle ? bufferToBase64Url(response.userHandle) : '',
    };
};

export class FlowServerError extends Error {
    isServerError = true;
    constructor(message: string) {
        super(message);
        this.name = 'FlowServerError';
    }
}

type NativeAuthSubmitPayload =
  | { type: typeof NativeAuthSubmitType.INPUT; [key: string]: string }
  | { type: typeof NativeAuthSubmitType.SOCIAL; code: string }
  | { type: typeof NativeAuthSubmitType.OTP; otp: string };

interface SignOutFlowResponse {
    flowStatus?: string;
    executionId?: string;
    data?: {
        actions?: Array<{ ref: string }>;
    };
}

/**
 * Terminates the SSO session by running the application's sign-out flow.
 *
 * The sign-out flow is driven the same way as authentication: proxied through /api/flow, so the
 * browser never needs the applicationId or Flow Secret. Any confirmation step it returns is
 * submitted straight away, since clicking sign out in the app is itself the confirmation. The SSO
 * session is identified by the per-flow cookie the server set during sign-in, so every call sends
 * credentials.
 *
 * @returns {Promise<void>} - Resolves only once the flow reports COMPLETE. Rejects otherwise, so a
 *                            caller is never told the session ended when it may still be alive.
 */
export const signOutNatively = async (): Promise<void> => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const execute = async (body: Record<string, string>): Promise<SignOutFlowResponse> => {
        const response = await fetch(FLOW_API_PATH, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})) as {
                message?: { defaultValue?: string };
                description?: { defaultValue?: string };
            };
            throw new Error(
                errorData?.message?.defaultValue
                || errorData?.description?.defaultValue
                || 'Error initiating native sign out request.',
            );
        }

        return await response.json() as SignOutFlowResponse;
    };

    let step = await execute({ flowType: 'SIGNOUT' });

    // The default sign-out flow confirms with the user before ending the session. Submit that
    // confirmation automatically; guard the loop so a flow that never completes cannot spin.
    for (let i = 0; i < 5 && step.flowStatus !== 'COMPLETE'; i++) {
        const actions = step.data?.actions ?? [];
        if (actions.length === 0 || !step.executionId) {
            break;
        }

        // A step offering a choice cannot be answered without knowing what each option means, so
        // only an unambiguous single action is submitted rather than guessing by list position.
        if (actions.length > 1) {
            throw new Error(
                `Sign-out flow returned ${actions.length} actions (${actions.map(a => a.ref).join(', ')}); ` +
                'this sample only drives a single-action confirmation.',
            );
        }

        step = await execute({
            flowType: 'SIGNOUT',
            executionId: step.executionId,
            action: actions[0].ref,
        });
    }

    if (step.flowStatus !== 'COMPLETE') {
        throw new Error(`Sign-out flow did not complete (flowStatus: ${step.flowStatus ?? 'unknown'}).`);
    }
};

/**
 * Initiates the native authentication or registration flow by sending a POST request to the flow endpoint.
 *
 * @param {string} flowType - The type of flow to initiate. Defaults to 'LOGIN'.
 * @returns {Promise<object>} - A promise that resolves to the response data from the server.
 */
export const initiateNativeAuthFlow = async (flowType: 'LOGIN' | 'REGISTRATION' | 'RECOVERY' = 'LOGIN') => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const data: Record<string, string> = {};

    if (flowType === 'REGISTRATION') {
        data.flowType = 'REGISTRATION';
    } else if (flowType === 'RECOVERY') {
        data.flowType = 'RECOVERY';
    } else {
        data.flowType = 'AUTHENTICATION';
    }

    const response = await fetch(FLOW_API_PATH, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as {
            message?: { defaultValue?: string };
            description?: { defaultValue?: string };
        };
        const flowTypeName = flowType === 'REGISTRATION'
            ? 'registration'
            : flowType === 'RECOVERY'
                ? 'recovery'
                : 'authentication';
        const message = errorData?.message?.defaultValue
            || errorData?.description?.defaultValue
            || `Error initiating native ${flowTypeName} request.`;
        throw new Error(message);
    }

    return { data: await response.json() };
};

/**
 * Initiates the native authentication or registration flow with additional data.
 * 
 * @param {string} flowType - The type of flow to initiate. Defaults to 'LOGIN'.
 * @param {string} actionId - The ID of the action to execute.
 * @param {object} inputs - Optional input data to include in the request.
 * @returns {Promise<object>} - A promise that resolves to the response data from the server.
 */
export const initiateNativeAuthFlowWithData = async (flowType: 'LOGIN' | 'REGISTRATION' = 'LOGIN', 
    actionId: string | null, inputs?: Record<string, unknown>) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const data: Record<string, unknown> = {};

    if (actionId) {
        data.action = actionId;
    }

    if (flowType === 'REGISTRATION') {
        data.flowType = 'REGISTRATION';
    } else {
        data.flowType = 'AUTHENTICATION';
    }

    // Include inputs if provided
    if (inputs && Object.keys(inputs).length > 0) {
        data.inputs = inputs;
    }

    const response = await fetch(FLOW_API_PATH, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as {
            message?: { defaultValue?: string };
            description?: { defaultValue?: string };
        };
        const flowTypeName = flowType === 'REGISTRATION' ? 'registration' : 'authentication';
        const message = errorData?.message?.defaultValue
            || errorData?.description?.defaultValue
            || `Error initiating native ${flowTypeName} request.`;
        throw new Error(message);
    }

    return { data: await response.json() };
};

/**
 * Submits the user's selected authentication option when multiple options are available.
 * 
 * @param {string} executionId - The flow ID received from the initiateNativeAuth response.
 * @param {string} actionId - The ID of the selected authentication action.
 * @param {object} inputs - Optional input data to submit with the decision.
 * @param {string} challengeToken - Optional challenge token for the current step, if required by the server.
 * @returns {Promise<object>} - A promise that resolves to the response data from the server.
 */
export const submitAuthDecision = async (executionId: string, actionId: string, inputs?: Record<string, unknown>, challengeToken?: string) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const data: Record<string, unknown> = {
        executionId: executionId,
        action: actionId
    };

    if (challengeToken) {
        data.challengeToken = challengeToken;
    }

    // Include inputs if provided
    if (inputs && Object.keys(inputs).length > 0) {
        data.inputs = inputs;
    }

    const response = await fetch(FLOW_API_PATH, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as {
            message?: { defaultValue?: string };
            description?: { defaultValue?: string };
        };
        const message = errorData?.message?.defaultValue
            || errorData?.description?.defaultValue
            || 'Error processing authentication option.';
        if (response.status >= 500) throw new FlowServerError(message);
        throw new Error(message);
    }

    return { data: await response.json() };
};

/**
 * Submits the native authentication form data to the server.
 * 
 * @param {string} executionId - The flow ID received from the initiateNativeAuth response.
 * @param {object} payload - The payload containing the form data or other required information.
 * @param {string} action - Optional action ref to include in the request.
 * @param {string} challengeToken - Optional challenge token for the current step, if required by the server.
 * @returns {Promise<object>} - A promise that resolves to the response data from the server.
 */
export const submitNativeAuth = async (
    executionId: string,
    payload: Record<string, unknown> | NativeAuthSubmitPayload,
    action?: string,
    challengeToken?: string
) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const data: Record<string, unknown> = {
        executionId: executionId
    };

    // Include action if provided
    if (action) {
        data.action = action;
    }

    if (challengeToken) {
        data.challengeToken = challengeToken;
    }

    if ('type' in payload) {
        if (payload.type === NativeAuthSubmitType.INPUT) {
            // For input type, include all fields except 'type'
            const { ...inputValues } = payload;
            data.inputs = inputValues;
        } else if (payload.type === NativeAuthSubmitType.SOCIAL) {
            data.inputs = {
                code: payload.code
            };
        } else if (payload.type === NativeAuthSubmitType.OTP) {
            data.inputs = {
                otp: payload.otp
            };
        }
    } else {
        // Handle as generic payload
        data.inputs = payload;
    }

    const response = await fetch(FLOW_API_PATH, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as {
            message?: { defaultValue?: string };
            description?: { defaultValue?: string };
        };
        const message = errorData?.message?.defaultValue
            || errorData?.description?.defaultValue
            || 'Login failed. Please check your credentials.';
        if (response.status >= 500) throw new FlowServerError(message);
        throw new Error(message);
    }

    return { data: await response.json() };
}
