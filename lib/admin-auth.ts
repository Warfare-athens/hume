import { NextRequest, NextResponse } from "next/server";

function getIncomingToken(request: NextRequest): string | null {
  const headerToken = request.headers.get("x-admin-token");
  if (headerToken) return headerToken;

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export function requireAdminToken(request: NextRequest): NextResponse | null {
  const expectedToken = process.env.ADMIN_API_TOKEN;

  // If no token configured, keep write endpoints open for local development.
  if (!expectedToken) return null;

  const incomingToken = getIncomingToken(request);
  if (incomingToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

