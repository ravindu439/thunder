// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// JWT decoding for display only. Signatures are never verified: the playground shows what ThunderID
// put in the token, they do not consume it as a relying party would.

// Decode only the header and claims segments. The third segment is the binary signature, not JSON.
export function decodeJwt(token) {
  try {
    const [header, claims] = token
      .split(".")
      .slice(0, 2)
      .map((seg) => JSON.parse(Buffer.from(seg.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")));
    if (!claims) return null;
    return {header, claims};
  } catch {
    return null;
  }
}

// Flatten sub plus the nested act chain into [subject, actor1, actor2, ...], most recent actor
// first. A token with no act claim yields just the subject.
export function actorChain(claims) {
  const out = [{role: "subject", sub: claims.sub}];
  let a = claims.act;
  while (a && typeof a === "object") {
    out.push({role: "actor", sub: a.sub});
    a = a.act;
  }
  return out;
}
