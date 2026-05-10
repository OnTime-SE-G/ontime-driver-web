"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("keycloak", { callbackUrl: "/dashboard" });
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
            <div>
              <input
                disabled
                placeholder="Provided by Keycloak"
                className="auth-input opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="auth-field-label">Passcode</label>
            <div>
              <input
                type="password"
                disabled
                placeholder="Provided by Keycloak"
                className="auth-input opacity-60"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Redirecting..." : "Initiate Shift"}
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
