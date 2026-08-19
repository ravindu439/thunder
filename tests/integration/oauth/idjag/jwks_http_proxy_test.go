// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package idjag

import (
	"fmt"
	"io"
	"net"
	"net/http"

	"github.com/thunder-id/thunderid/tests/integration/testutils"
)

// jwksHTTPProxy re-serves ThunderID's own JWKS endpoint over plain HTTP. It exists
// for the self-referencing IdP used by TestIDJAG_FullRoundtrip: the server's outbound
// JWKS fetch (used to validate the ID-JAG it consumes) does not trust the distribution's
// self-signed dev TLS certificate, so the IdP's jwks_endpoint is pointed at this plain-HTTP
// proxy instead of the real HTTPS endpoint. The issuer property stays the real ThunderID
// issuer; only the JWKS fetch URL changes.
type jwksHTTPProxy struct {
	listener net.Listener
	server   *http.Server
}

// newJWKSHTTPProxy starts the proxy on an OS-assigned local port.
func newJWKSHTTPProxy() (*jwksHTTPProxy, error) {
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return nil, fmt.Errorf("failed to listen: %w", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/jwks", handleJWKSProxyRequest)

	p := &jwksHTTPProxy{
		listener: listener,
		server:   &http.Server{Handler: mux},
	}

	go func() {
		_ = p.server.Serve(listener)
	}()

	return p, nil
}

// handleJWKSProxyRequest fetches ThunderID's JWKS over HTTPS (skipping TLS verification,
// as the test client does elsewhere) and re-serves it over plain HTTP.
func handleJWKSProxyRequest(w http.ResponseWriter, r *http.Request) {
	resp, err := testutils.GetRawHTTPClient().Get(testutils.TestServerURL + "/oauth2/jwks")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	_, _ = w.Write(body)
}

// URL returns the plain-HTTP JWKS URL to use as the IdP's jwks_endpoint.
func (p *jwksHTTPProxy) URL() string {
	return fmt.Sprintf("http://%s/jwks", p.listener.Addr().String())
}

// Stop shuts down the proxy.
func (p *jwksHTTPProxy) Stop() error {
	return p.server.Close()
}
