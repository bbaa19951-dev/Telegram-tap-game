// src/pages/Shop.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { submitPayment, getAppSettings } from "../lib/api";
import BottomNav from "../components/BottomNav";

const LEVELS = [
  {
    key: "Wood",
    price: 1000,
    dailyPoints: "33,300",
    emoji: "🪵",
    color: "from-amber-700 to-amber-900",
    textColor: "text-amber-400",
  },
  {
    key: "Bronze",
    price: 3000,
    dailyPoints: "99,900",
    emoji: "🥉",
    color: "from-yellow-700 to-yellow-900",
    textColor: "text-yellow-400",
  },
  {
    key: "Silver",
    price: 10000,
    dailyPoints: "333,000",
    emoji: "🥈",
    color: "from-gray-400 to-gray-600",
    textColor: "text-gray-300",
  },
  {
    key: "Gold",
    price: 20000,
    dailyPoints: "666,000",
    emoji: "🥇",
    color: "from-yellow-400 to-amber-600",
    textColor: "text-gold",
  },
  {
    key: "Diamond",
    price: 30000,
    dailyPoints: "999,000",
    emoji: "💎",
    color: "from-cyan-400 to-blue-600",
    textColor: "text-cyan-300",
  },
  {
    key: "Legend",
    price: 60000,
    dailyPoints: "1,998,000",
    emoji: "👑",
    color: "from-purple-500 to-pink-600",
    textColor: "text-purple-300",
  },
];

export default function Shop() {
  const { token } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(
    "Bank of Abyssinia\nAccount: 165669398\nName: Barsanaol Kumsa"
  );
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getAppSettings()
      .then((settings) => {
        if (settings.bank_details) setBankDetails(settings.bank_details);
      })
      .catch(console.error);
  }, []);

  const handleSelect = (level: string) => {
    setSelected(level);
    setMessage("");
    setProofUrl("");
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById("submit-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmit = async () => {
    if (!selected || !proofUrl || !token) return;
    setLoading(true);
    setMessage("");
    try {
      await submitPayment(token, selected, proofUrl);
      setMessage("✅ Proof submitted successfully! Admin will review and upgrade your membership.");
      setProofUrl("");
      setShowForm(false);
      setSelected(null);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedLevel = LEVELS.find((l) => l.key === selected);

  return (
    <div className="min-h-screen p-4 pb-20 max-w-sm mx-auto flex flex-col gap-6">
      {/* Hero Section */}
      <div className="text-center mt-4">
        <span className="text-4xl">👑</span>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
          Upgrade Your Membership
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Unlock higher earnings and exclusive benefits
        </p>
      </div>

      {/* Membership Cards */}
      <div className="flex flex-col gap-3">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.key}
            onClick={() => handleSelect(lvl.key)}
            className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-[1.02] ${
              selected === lvl.key
                ? "border-gold bg-gradient-to-r from-gold/20 to-amber-900/30 shadow-lg shadow-gold/20"
                : "border-gray-700 bg-glass hover:border-gray-500"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{lvl.emoji}</span>
              <div className="flex-1 text-left">
                <h3 className={`font-bold text-lg ${lvl.textColor}`}>{lvl.key}</h3>
                <p className="text-xs text-gray-400">
                  {lvl.dailyPoints} daily points
                </p>
                <p className="text-xs text-gray-500">
                  + Daily Reward, Auto Tap & more
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  {lvl.price.toLocaleString()} ETB
                </p>
                <p className="text-xs text-gray-500">one-time</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Submission Form */}
      {showForm && selectedLevel && (
        <div
          id="submit-form"
          className="glass rounded-2xl p-6 border border-gold/30 animate-fade-in"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedLevel.emoji}</span>
            <div>
              <h3 className={`font-bold text-lg ${selectedLevel.textColor}`}>
                {selectedLevel.key} Membership
              </h3>
              <p className="text-sm text-gray-300">
                {selectedLevel.price.toLocaleString()} ETB one‑time payment
              </p>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-400 mb-2">🏦 Send payment to:</p>
            <pre className="text-sm text-white whitespace-pre-line font-mono">
              {bankDetails}
            </pre>
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-2">
              📎 Paste your payment receipt/proof URL
            </label>
            <input
              type="text"
              placeholder="https://example.com/receipt.png"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-gold focus:outline-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !proofUrl}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-amber-600 text-black font-bold text-lg shadow-lg shadow-gold/20 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] transition transform"
          >
            {loading ? "Submitting..." : "Submit Proof & Upgrade"}
          </button>

          {message && (
            <p
              className={`text-sm text-center mt-3 ${
                message.startsWith("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}

      {/* Decorative element */}
      <div className="text-center text-gray-700 text-xs mt-4">
        🔒 Secure review by admin · Instant upgrade after approval
      </div>

      <BottomNav />
    </div>
  );
      }
