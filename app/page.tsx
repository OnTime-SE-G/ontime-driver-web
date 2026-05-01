"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {/* HEADER */}
        <div className="auth-header">
          <h1 className="auth-brand">On Time</h1>
          <p className="auth-subtitle">Operator Authentication Portal</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="auth-form">
          {/* Operator ID */}
          <div>
            <label className="auth-field-label">Operator ID</label>

            <div>
              <input
                placeholder="Enter your 6-digit ID"
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="auth-field-label">Passcode</label>

            <div>
              <input
                type="password"
                placeholder="••••••••"
                className="auth-input"
              />
            </div>
          </div>

          {/* Options */}
          <div className="auth-row">
            <label className="auth-remember">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#" className="auth-link">
              Forgot Passcode?
            </a>
          </div>

          {/* Button */}
          <button type="submit" className="auth-button">
            Initiate Shift
          </button>
        </form>

        {/* FOOTER */}
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
