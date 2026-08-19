# MCP Calculator Sample

A scope-protected MCP server secured with ThunderID. The server exposes four calculator tools, each gated behind its own OAuth scope, so a caller only sees the tools its token's scopes allow.

This sample is the companion code for the [Secure Your MCP Server](https://thunderid.dev/docs/next/getting-started/connect-your-mcp/python/) quickstart, which walks through building `server.py`, registering the resource server, scopes, and role in ThunderID, and connecting to the server from MCP Inspector or Claude Code.

## Project Structure

```text
mcp-calculator-sample/
├── README.md              This file
├── .gitignore             Ignores local secrets
└── server/
    ├── server.py          FastMCP resource server: add, subtract, multiply, divide
    ├── .env.example       Template for the server's environment variables
    ├── .env               Created locally, gitignored: your copy of .env.example
    └── thunderid.cert     Created locally, gitignored: exported ThunderID certificate
```

## Prerequisites

- A running ThunderID instance, reachable at `https://localhost:8090`.
- [`uv`](https://docs.astral.sh/uv/), which manages Python and dependencies for `server.py` automatically.
- Node.js 22.19 or later, if you plan to connect with MCP Inspector.
- The Calculator MCP resource server, its four tool scopes, and a role that grants them to your test user, registered in ThunderID Console. Follow **Register the MCP Resource and Scopes** and **Create a Role for the Calculator Permissions** in [Secure Your MCP Server](https://thunderid.dev/docs/next/getting-started/connect-your-mcp/python/).

## Run the Server

From `server/`:

1. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

2. Export ThunderID's self-signed certificate so the server can verify the JWKS endpoint over HTTPS. With ThunderID running, run this from the `server/` directory:

   ```bash
   openssl s_client -connect localhost:8090 -showcerts </dev/null 2>/dev/null | openssl x509 > thunderid.cert
   ```

3. Start the server:

   ```bash
   uv run server.py
   ```

The server listens at `http://localhost:8000/mcp` and rejects any request without a valid, appropriately scoped ThunderID access token. See [Configure the Environment](https://thunderid.dev/docs/next/getting-started/connect-your-mcp/python/#configure-the-environment) for what each `.env` variable does.

## Connect a Client

With the server running, connect to it from MCP Inspector or Claude Code. Both flows are covered in [Connect an MCP Client](https://thunderid.dev/docs/next/getting-started/connect-your-mcp/python/#connect-an-mcp-client): Inspector uses a client application you register in the Console, and Claude Code registers itself through Dynamic Client Registration.

## Troubleshooting

- **`npm error code EBADDEVENGINES`** when launching MCP Inspector with `NODE_EXTRA_CA_CERTS=./thunderid.cert npx @modelcontextprotocol/inspector` from `server/`: npm walked up to this repository's root `package.json`, which pins `pnpm` as the package manager, and refuses to run under plain `npm`. Launch Inspector from a directory outside the repository instead, pointing `NODE_EXTRA_CA_CERTS` at the absolute path of `thunderid.cert`.

## Learn More

- [Secure Your MCP Server](https://thunderid.dev/docs/next/getting-started/connect-your-mcp/python/)
- [Securing MCP](https://thunderid.dev/docs/next/use-cases/ai-agents/mcp-authorization/overview/)
