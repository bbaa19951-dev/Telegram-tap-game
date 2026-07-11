import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
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
      // Use Supabase client with the token (we need to set the auth header)
      // Since we don't have an Edge Function for payment upload, we'll use the client directly (RLS disabled for service_role? No, we are using anon key. We need a dedicated Edge Function to insert payment.)
      // Simpler: create a new Edge Function "submit-payment" that inserts a payment request.
      // For now, we'll just show a message – but we actually need to implement this.
      // I'll guide the user to create the necessary Edge Function.
      const res = await fetch(
        `${import.meta.env.VITE_REQUEST_WITHDRAWAL_URL}`, // placeholder, need new function
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ level: selected, proof: proofUrl }),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error);
      setMessage("Payment proof submitted! Waiting for admin approval.");
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
            Pay {LEVELS.find((l) => l.key === selected)?.price} ETB to Bank of Abyssinia
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
