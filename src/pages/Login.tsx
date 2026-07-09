// src/pages/Login.tsx

import { useTelegram } from "../hooks/useTelegram";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Login() {
  const { initData } = useTelegram();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!initData) {
      setError("Open this app inside Telegram");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(initData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass rounded-2xl p-8 text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gold mb-4">Tap to Earn</h1>
        <p className="text-gray-300 mb-6">Sign in securely with your Telegram account</p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gold text-black py-3 rounded-xl font-semibold hover:bg-yellow-500 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Login with Telegram"}
        </button>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
}
