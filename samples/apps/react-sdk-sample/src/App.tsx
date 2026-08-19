// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import "./App.css";
import { SignedIn, SignedOut, SignInButton } from "@thunderid/react";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <SignedIn>
        <HomePage />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
}

export default App;
