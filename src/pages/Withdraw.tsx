// src/pages/Withdraw.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { requestWithdrawal, getUserWithdrawals } from "../lib/api";

export default function Withdraw() {
  const { token } = useAuth();
  const [points, setPoints] = useState("");
  const [bank, setBank] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    getUserWithdrawals(token).then(res => setHistory(res.withdrawals)).catch(console.error);
  }, [token]);

  const handleSubmit = async () => {
    if (!token || !points || !bank) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await requestWithdrawal(token, parseInt(points), bank);
      setMessage(`Request submitted. Fee: ${res.fee} points, net: ${res.net_points} points.`);
      getUserWithdrawals(token).then(r => setHistory(r.withdrawals));
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-sm mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gold text-center">Withdraw</h2>
      <div className="glass rounded-xl p-4">
        <p className="text-sm text-gray-400">Points to withdraw</p>
        <input
          type="number"
          value={points}
          onChange={e => setPoints(e.target.value)}
          className="w-full p-2 mt-1 rounded-lg bg-gray-800 text-white"
          placeholder="Enter points"
        />
        <p className="text-sm text-gray-400 mt-2">Bank details (BOA account)</p>
        <input
          value={bank}
          onChange={e => setBank(e.target.value)}
          className="w-full p-2 mt-1 rounded-lg bg-gray-800 text-white"
          placeholder="Account name & number"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 py-2 rounded-lg bg-gold text-black font-semibold disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Request Withdrawal"}
        </button>
        {message && <p className="text-xs mt-2 text-center">{message}</p>}
      </div>

      <div className="glass rounded-xl p-4">
        <h3 className="text-lg font-bold mb-2">History</h3>
        {history.length === 0 && <p className="text-gray-500 text-sm">No withdrawals yet.</p>}
        {history.map(w => (
          <div key={w.id} className="flex justify-between text-sm py-1 border-b border-gray-700 last:border-0">
            <span>{w.points} pts</span>
            <span className={`${w.status === "approved" ? "text-green-400" : w.status === "rejected" ? "text-red-400" : "text-yellow-400"}`}>
              {w.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
