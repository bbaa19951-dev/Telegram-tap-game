// src/pages/Login.tsx
import { useTelegram } from "../hooks/useTelegram";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Login() {
  const { initData } = useTelegram();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getStartParam = (): string | undefined => {
    if (!initData) return undefined;
    const params = new URLSearchParams(initData);
    return params.get("start_param") || undefined;
  };

  const handleLogin = async () => {
    if (!initData) {
      setError("❌ initData missing – open this inside Telegram.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(initData, getStartParam());
    } catch (err: any) {
      setError(`❌ ${err.message}\n\nRaw: ${JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass rounded-2xl p-8 text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gold mb-4">Tap to Earn</h1>
        <p className="text-gray-300 mb-6">Sign in securely with Telegram</p>

        {/* debug: show initData presence */}
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
          <pre className="text-red-400 mt-4 text-xs text-left whitespace-pre-wrap break-words">
            {error}
          </pre>
        )}
      </div>
    </div>
  );
}
