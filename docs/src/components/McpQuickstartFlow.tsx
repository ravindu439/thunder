// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {DocusaurusProductConfig} from '@site/docusaurus.product.config';
import './WayfinderDiagrams.css';

function PersonIcon({className = undefined}: {className?: string}) {
  return (
    <g className={className}>
      <circle cx="28" cy="28" r="26" />
      <g transform="translate(28,28)" className="uc-agent-wayfinder-person-glyph">
        <circle cx="0" cy="-6" r="7" />
        <path d="M -13 14 C -13 4 13 4 13 14 Z" />
      </g>
    </g>
  );
}

export function McpOAuthFlowDiagram() {
  const {siteConfig} = useDocusaurusContext();
  const productName =
    (siteConfig.customFields?.product as DocusaurusProductConfig | undefined)?.project.name ?? siteConfig.title;

  return (
    <div className="uc-agent-wayfinder-arch uc-mcp-qs-arch">
      <svg
        className="uc-agent-wayfinder-arch__svg"
        viewBox="0 0 820 330"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`MCP OAuth flow: an MCP client discovers ${productName} as the authorization server through RFC 9728 metadata, obtains a scoped JWT via Authorization Code with PKCE, then calls MCP tools with the token. The MCP server validates the JWT offline against ${productName}'s JWKS endpoint.`}
      >
        <defs>
          <marker
            id="mcp-qs-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        {/* User at top */}
        <g className="uc-agent-wayfinder-arch__consumers">
          <text x="170" y="12" textAnchor="middle" className="uc-agent-wayfinder-arch__group-label">
            User
          </text>
          <g transform="translate(156,20)">
            <g transform="scale(0.5)">
              <PersonIcon className="uc-agent-wayfinder-arch__icon" />
            </g>
          </g>
        </g>

        {/* User → MCP Client */}
        <g className="uc-agent-wayfinder-arch__edges">
          <line x1="170" y1="52" x2="170" y2="76" markerEnd="url(#mcp-qs-arrow)" />
        </g>

        {/* MCP Client */}
        <g className="uc-agent-wayfinder-arch__app" transform="translate(20,76)">
          <rect width="300" height="88" rx="10" />
          <text x="150" y="30" textAnchor="middle" className="uc-agent-wayfinder-arch__app-title">
            MCP Client
          </text>
          <text x="150" y="50" textAnchor="middle" className="uc-agent-wayfinder-arch__sub">
            e.g., Claude Desktop, MCP Inspector
          </text>
          <line x1="24" y1="62" x2="276" y2="62" className="uc-agent-wayfinder-arch__divider" />
          <text x="150" y="79" textAnchor="middle" className="uc-agent-wayfinder-arch__detail">
            Discovers auth, signs in, calls tools
          </text>
        </g>

        {/* ThunderID — tall box on the right */}
        <g className="uc-agent-wayfinder-arch__idp" transform="translate(560,76)">
          <rect width="220" height="240" rx="10" />
          <text x="110" y="42" textAnchor="middle" className="uc-agent-wayfinder-arch__idp-title">
            {productName}
          </text>
          <text x="110" y="64" textAnchor="middle" className="uc-agent-wayfinder-arch__sub">
            Authorization Server
          </text>
          <line x1="26" y1="78" x2="194" y2="78" className="uc-agent-wayfinder-arch__divider" />
          <text x="110" y="104" textAnchor="middle" className="uc-agent-wayfinder-arch__detail">
            Signs users in and
          </text>
          <text x="110" y="122" textAnchor="middle" className="uc-agent-wayfinder-arch__detail">
            issues scoped JWTs
          </text>
        </g>

        {/* Your MCP Server — bottom left */}
        <g className="uc-agent-wayfinder-arch__svc" transform="translate(20,228)">
          <rect width="300" height="88" rx="10" />
          <text x="150" y="30" textAnchor="middle" className="uc-agent-wayfinder-arch__app-title">
            Your MCP Server
          </text>
          <text x="150" y="50" textAnchor="middle" className="uc-agent-wayfinder-arch__sub">
            OAuth 2.0 Resource Server
          </text>
          <line x1="24" y1="62" x2="276" y2="62" className="uc-agent-wayfinder-arch__divider" />
          <text x="150" y="79" textAnchor="middle" className="uc-agent-wayfinder-arch__detail">
            Publishes RFC 9728 metadata, validates JWTs
          </text>
        </g>

        {/* Edges */}
        <g className="uc-agent-wayfinder-arch__edges">
          {/* MCP Client → ThunderID: Sign in */}
          <line x1="320" y1="110" x2="560" y2="110" markerEnd="url(#mcp-qs-arrow)" />
          <text x="440" y="102" textAnchor="middle" className="uc-agent-wayfinder-arch__edge-label">
            Sign in (Auth Code + PKCE)
          </text>

          {/* ThunderID → MCP Client: Token */}
          <line x1="560" y1="136" x2="320" y2="136" markerEnd="url(#mcp-qs-arrow)" />
          <text x="440" y="152" textAnchor="middle" className="uc-agent-wayfinder-arch__edge-label">
            Scoped access token (JWT)
          </text>

          {/* MCP Client → Your MCP Server: Call tools */}
          <line x1="170" y1="164" x2="170" y2="228" markerEnd="url(#mcp-qs-arrow)" />
          <text x="184" y="200" className="uc-agent-wayfinder-arch__edge-label">
            Call tools with token
          </text>

          {/* Your MCP Server → ThunderID: Validate */}
          <line x1="320" y1="272" x2="560" y2="272" markerEnd="url(#mcp-qs-arrow)" />
          <text x="440" y="264" textAnchor="middle" className="uc-agent-wayfinder-arch__edge-label">
            Validate JWT via JWKS
          </text>
        </g>
      </svg>
    </div>
  );
}
