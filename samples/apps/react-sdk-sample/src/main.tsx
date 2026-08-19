// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThunderIDProvider } from "@thunderid/react";
import { ConfigurationError } from "./ConfigurationError.tsx";
import config from "./config.tsx";

const baseUrl = config.baseUrl;
const clientId = config.clientId;

// Validate required configuration
const missingConfig: string[] = [];
if (!baseUrl) {
    missingConfig.push("baseUrl");
}
if (!clientId) {
    missingConfig.push("clientId");
}

if (missingConfig.length > 0) {
    console.error(
        "⚠️ Missing required configuration:",
        missingConfig.join(", "),
    );
    console.error(
        "Please configure these values in public/runtime.json. See the documentation for reference.",
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {missingConfig.length > 0 ? (
            <ConfigurationError missingConfig={missingConfig} />
        ) : (
            <ThunderIDProvider
                baseUrl={baseUrl}
                clientId={clientId}
                scopes={config.scopes}
            >
                <App />
            </ThunderIDProvider>
        )}
    </StrictMode>,
);
