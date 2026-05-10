"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid Operator ID or Passcode.");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-brand">On Time</h1>
          <p className="auth-subtitle">Operator Authentication Portal</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div>
            <label className="auth-field-label">Operator ID</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="Enter your operator ID"
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-field-label">Passcode</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Enter your passcode"
              className="auth-input"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
          )}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Authenticating..." : "Initiate Shift"}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Secure access for authorized personnel only. <br />
            Contact <span className="auth-emphasis">Dispatch Support</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
