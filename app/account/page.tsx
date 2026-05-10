"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { User, CreditCard, Phone, Shield } from "lucide-react";

export default function AccountPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (form.newPassword.length < 6) { setMessage({ type: "error", text: "New password must be at least 6 characters" }); return; }
    if (form.newPassword !== form.confirmPassword) { setMessage({ type: "error", text: "Passwords do not match" }); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage({ type: "error", text: data.error ?? "Failed to change password" }); return; }
      setMessage({ type: "success", text: "Password changed. Please sign in again." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => signOut({ callbackUrl: "/" }), 2000);
    } catch {
      setMessage({ type: "error", text: "Unexpected error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-sm text-gray-500">Manage your profile and security settings</p>
      </div>

      {/* Driver Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Driver Profile</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
              <User size={16} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Full Name</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">{session?.user?.name ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
              <CreditCard size={16} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Operator ID</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">{session?.operatorId ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
              <Phone size={16} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">{session?.user?.email ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-green-50 p-2 text-green-600">
              <Shield size={16} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Role</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">Driver</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" required value={form.currentPassword}
              onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
              className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" required value={form.newPassword}
              onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
              className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" required value={form.confirmPassword}
              onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
              className={inputCls} />
          </div>
          {message && (
            <p className={`rounded-lg px-4 py-2 text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message.text}
            </p>
          )}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
