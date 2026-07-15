// src/pages/Withdraw.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { requestWithdrawal, getUserWithdrawals, getBanks } from "../lib/api";

interface Bank {
  id: number;
  name: string;
  logo_url: string | null;
  account_number: string;
  account_name: string;
}

export default function Withdraw() {
  const { token } = useAuth();
  const [points, setPoints] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [showBankGrid, setShowBankGrid] = useState(false);

  useEffect(() => {
    if (!token) return;
    getUserWithdrawals(token).then(res => setHistory(res.withdrawals)).catch(console.error);
    getBanks().then(res => setBanks(res.banks)).catch(console.error);
  }, [token]);

  const handleSubmit = async () => {
    if (!token || !points || !selectedBank || !accountNumber) return;
    setLoading(true);
    setMessage("");
    // Build bank details string from selected bank
    const bankDetails = `Bank: ${selectedBank.name}\nAccount: ${accountNumber}\nName: ${selectedBank.account_name}`;
    try {
      const res = await requestWithdrawal(token, parseInt(points), bankDetails);
      setMessage(`✅ Request submitted. Fee: ${res.fee} points, net: ${res.net_points} points.`);
      getUserWithdrawals(token).then(r => setHistory(r.withdrawals));
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20 max-w-sm mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gold text-center">Withdraw</h2>

      <div className="glass rounded-2xl p-6 border border-gold/20">
        <p className="text-sm text-gray-400 mb-2">Points to withdraw</p>
        <input
          type="number"
          value={points}
          onChange={e => setPoints(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-gold"
          placeholder="Enter points"
        />

        {/* Bank Selector */}
        <p className="text-sm text-gray-400 mt-4 mb-2">Select Bank</p>
        {!showBankGrid ? (
          <button
            onClick={() => setShowBankGrid(true)}
            className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 text-left"
          >
            {selectedBank ? (
              <span className="flex items-center gap-2">
                {selectedBank.logo_url ? (
                  <img src={selectedBank.logo_url} alt="" className="w-6 h-6 rounded" />
                ) : (
                  <span className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-xs">🏦</span>
                )}
                {selectedBank.name}
              </span>
            ) : (
              "Choose a bank"
            )}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => {
                  setSelectedBank(bank);
                  setShowBankGrid(false);
                }}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedBank?.id === bank.id
                    ? "border-gold bg-gold/10"
                    : "border-gray-700 bg-gray-800 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  {bank.logo_url ? (
                    <img src={bank.logo_url} alt={bank.name} className="w-8 h-8 rounded object-cover" />
                  ) : (
                    <span className="text-xl">🏦</span>
                  )}
                  <span className="text-xs font-medium text-white">{bank.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Account Number */}
        <p className="text-sm text-gray-400 mt-4 mb-2">Your Account Number</p>
        <input
          value={accountNumber}
          onChange={e => setAccountNumber(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:border-gold"
          placeholder="Enter your account number"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !points || !selectedBank || !accountNumber}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-600 text-black font-bold text-lg shadow-lg shadow-gold/20 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Request Withdrawal"}
        </button>
        {message && (
          <p className={`text-sm text-center mt-3 ${message.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>

      <div className="glass rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-3">History</h3>
        {history.length === 0 && <p className="text-gray-500 text-sm">No withdrawals yet.</p>}
        {history.map(w => (
          <div key={w.id} className="flex justify-between text-sm py-2 border-b border-gray-700/50 last:border-0">
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
