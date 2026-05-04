"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [licenseNumber, setLicenseNumber] = useState("");

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
          {/* License Number */}
          <div>
            <label className="auth-field-label">License Number</label>
            <div>
              <input
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="Enter your license number"
                className="auth-input"
              />
            </div>
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
