// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export function BookingsUnavailable() {
  return (
    <main className="bookings-page">
      <section className="management-empty">
        <div>
          <p className="eyebrow">Bookings</p>
          <h1>Configure sign-in to manage bookings.</h1>
          <p>Live booking management is available after the authentication client settings are added.</p>
        </div>
      </section>
    </main>
  );
}
