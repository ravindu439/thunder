# /// script
# requires-python = ">=3.11"
# dependencies = ["fastmcp>=3.4,<4", "python-dotenv>=1"]
# ///
"""Scope-protected calculator MCP server."""

import os

import httpx
from dotenv import load_dotenv
from fastmcp import FastMCP
from fastmcp.exceptions import ToolError
from fastmcp.server.auth import RemoteAuthProvider, require_scopes
from fastmcp.server.auth.providers.jwt import JWTVerifier

load_dotenv(override=True)

ISSUER = os.environ["THUNDERID_ISSUER"]
JWKS_URI = os.environ["THUNDERID_JWKS_URI"]
AUDIENCE = os.environ["MCP_AUDIENCE"]
CA_CERT = os.environ.get("THUNDERID_CA_CERT")

SCOPES = ["add", "subtract", "multiply", "divide"]

verifier = JWTVerifier(
    jwks_uri=JWKS_URI,
    issuer=ISSUER,
    audience=AUDIENCE,
    http_client=httpx.AsyncClient(verify=CA_CERT) if CA_CERT else None,
)

mcp = FastMCP(
    "Calculator",
    auth=RemoteAuthProvider(
        token_verifier=verifier,
        authorization_servers=[ISSUER],
        base_url="http://localhost:8000",
        scopes_supported=SCOPES,
    ),
)


@mcp.tool(auth=require_scopes("add"))
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b


@mcp.tool(auth=require_scopes("subtract"))
def subtract(a: float, b: float) -> float:
    """Subtract b from a."""
    return a - b


@mcp.tool(auth=require_scopes("multiply"))
def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b


@mcp.tool(auth=require_scopes("divide"))
def divide(a: float, b: float) -> float:
    """Divide a by b."""
    if b == 0:
        raise ToolError("Cannot divide by zero.")
    return a / b


if __name__ == "__main__":
    mcp.run(transport="http", host="localhost", port=8000)
