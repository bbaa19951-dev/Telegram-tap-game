// src/pages/Shop.tsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { submitPayment } from "../lib/api";
import BottomNav from "../components/BottomNav";

const LEVELS = [
  { key: "Wood", price: 1000 },
  { key: "Bronze", price: 3000 },
  { key: "Silver", price: 10000 },
  { key: "Gold", price: 20000 },
  { key: "Diamond", price: 30000 },
  { key: "Legend", price: 60000 },
];

export default function Shop() {
  const { token } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected || !proofUrl || !token) return;
    setLoading(true);
    setMessage("");
    try {
      await submitPayment(token, selected, proofUrl);
      setMessage("Proof submitted! Admin will review.");
      setProofUrl("");
      setSelected(null);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20 max-w-sm mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gold text-center">Upgrade Membership</h2>

      <div className="glass rounded-xl p-4 flex flex-col gap-2">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.key}
            onClick={() => setSelected(lvl.key)}
            className={`p-3 rounded-lg text-left ${
              selected === lvl.key
                ? "bg-gold text-black font-bold"
                : "bg-gray-800 text-white"
            }`}
          >
            {lvl.key} — {lvl.price.toLocaleString()} ETB
          </button>
        ))}
      </div>

      {selected && (
        <div className="glass rounded-xl p-4 flex flex-col gap-2">
          <p className="text-sm text-gray-400">
            Pay <strong>{LEVELS.find((l) => l.key === selected)?.price} ETB</strong> to
            Bank of Abyssinia.
          </p>
          <input
            type="text"
            placeholder="Paste receipt/proof URL"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 text-white"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !proofUrl}
            className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Proof"}
          </button>
          {message && <p className="text-xs text-center mt-2">{message}</p>}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
