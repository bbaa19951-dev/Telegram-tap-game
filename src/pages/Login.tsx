// src/pages/Login.tsx
import { useTelegram } from "../hooks/useTelegram";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { initData } = useTelegram();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home immediately
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const getStartParam = (): string | undefined => {
    if (!initData) return undefined;
    const params = new URLSearchParams(initData);
    return params.get("start_param") || undefined;
  };

  const handleLogin = async () => {
    if (!initData) {
      setError("❌ initData missing – open inside Telegram.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await login(initData, getStartParam());
      // Navigation is handled by the useEffect above when "user" becomes truthy
    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(`❌ ${msg}\n\nStack: ${err?.stack || "none"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass rounded-2xl p-8 text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gold mb-4">Tap to Earn</h1>
        <p className="text-gray-300 mb-6">Sign in securely with Telegram</p>

        <p className="text-xs text-gray-500 mb-2">
          {initData ? "✅ initData ready" : "⚠️ No initData"}
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gold text-black py-3 rounded-xl font-semibold hover:bg-yellow-500 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Login with Telegram"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-left">
            <pre className="text-red-300 text-xs whitespace-pre-wrap break-words">
              {error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
