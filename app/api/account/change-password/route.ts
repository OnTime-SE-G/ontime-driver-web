import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const KEYCLOAK_ISSUER = process.env.AUTH_KEYCLOAK_ISSUER!;
const CLIENT_ID = process.env.AUTH_KEYCLOAK_ID!;
const CLIENT_SECRET = process.env.AUTH_KEYCLOAK_SECRET!;
const ADMIN_BASE = KEYCLOAK_ISSUER.replace("/realms/ontime", "/admin/realms/ontime");
const TOKEN_URL = `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both passwords are required" }, { status: 400 });
  }

  // 1. Verify current password by attempting a token grant
  const username = session.user?.name ?? "";
  const verifyRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "password",
      username,
      password: currentPassword,
    }),
  });
  if (!verifyRes.ok) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  // 2. Get admin token to update the password
  const adminTokenRes = await fetch(
    KEYCLOAK_ISSUER.replace("/realms/ontime", "/realms/master/protocol/openid-connect/token"),
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: "admin-cli",
        grant_type: "password",
        username: process.env.KEYCLOAK_ADMIN_USER!,
        password: process.env.KEYCLOAK_ADMIN_PASSWORD!,
      }),
    }
  );
  const { access_token: adminToken } = await adminTokenRes.json();

  // 3. Look up the user by username
  const searchRes = await fetch(`${ADMIN_BASE}/users?username=${encodeURIComponent(username)}&exact=true`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const users = await searchRes.json();
  const userId = users[0]?.id;
  if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // 4. Reset password
  const resetRes = await fetch(`${ADMIN_BASE}/users/${userId}/reset-password`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "password", value: newPassword, temporary: false }),
  });
  if (!resetRes.ok) {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
