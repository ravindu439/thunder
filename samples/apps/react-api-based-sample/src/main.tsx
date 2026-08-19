// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { OxygenUIThemeProvider } from "@wso2/oxygen-ui";
import { router } from "./router";
import { loadConfig } from "./config";
import "./index.css";

loadConfig().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <OxygenUIThemeProvider>
        <RouterProvider router={router} />
      </OxygenUIThemeProvider>
    </StrictMode>
  );
});
