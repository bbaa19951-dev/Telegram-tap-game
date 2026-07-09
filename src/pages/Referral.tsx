// src/pages/Referral.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getReferralStats } from "../lib/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Referral() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    getReferralStats(token)
      .then(setStats)
      .catch(console.error);
  }, [token]);

  const BOT_USERNAME = "PointsToBirrBot";

  const referralLink = stats?.referral_code
    ? `https://t.me/${BOT_USERNAME}?start=${stats.referral_code}`
    : "";

  const copyLink = () => {
    navigator.clipboard?.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!stats) return <LoadingSpinner />;

  return (
    <div className="min-h-screen p-4 flex flex-col gap-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-gold text-center">Referral</h2>

      <div className="glass rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">Your referral code</p>
        <p className="text-xl font-mono mt-1">{stats.referral_code}</p>
        <button
          onClick={copyLink}
          className="mt-3 w-full py-2 rounded-lg bg-blue-600 text-white font-semibold"
        >
          {copied ? "Copied!" : "Copy invite link"}
        </button>
      </div>

      <div className="glass rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">Total invites</p>
        <p className="text-2xl font-bold">{stats.invites}</p>
      </div>

      <div className="glass rounded-xl p-4">
        <h3 className="text-lg font-bold mb-3">Leaderboard</h3>
        {stats.leaderboard?.map((entry: any, idx: number) => (
          <div key={entry.telegram_id} className="flex justify-between py-2 border-b border-gray-700 last:border-0">
            <span className="text-sm">
              {idx + 1}. {entry.name || entry.username}
            </span>
            <span className="text-sm text-gold">{entry.invites} inv.</span>
          </div>
        ))}
      </div>
    </div>
  );
      }
