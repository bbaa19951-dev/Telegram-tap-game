// src/pages/Referral.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getReferralStats } from "../lib/api";
import LoadingSpinner from "../components/LoadingSpinner";

const BONUS_TABLE = [
  { level: "Wood", points: "300,000", emoji: "🪵", color: "text-amber-400" },
  { level: "Bronze", points: "900,000", emoji: "🥉", color: "text-yellow-400" },
  { level: "Silver", points: "3,000,000", emoji: "🥈", color: "text-gray-300" },
  { level: "Gold", points: "6,000,000", emoji: "🥇", color: "text-gold" },
  { level: "Diamond", points: "9,000,000", emoji: "💎", color: "text-cyan-300" },
  { level: "Legend", points: "18,000,000", emoji: "👑", color: "text-purple-300" },
];

export default function Referral() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = () => {
    if (!token) return;
    setError("");
    getReferralStats(token)
      .then(setStats)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchStats();
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

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="glass rounded-xl p-6 text-center max-w-sm">
          <p className="text-red-400 mb-4">Failed to load referral stats</p>
          <pre className="text-xs text-gray-400 mb-4 whitespace-pre-wrap">{error}</pre>
          <button onClick={fetchStats} className="bg-gold text-black px-4 py-2 rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) return <LoadingSpinner />;

  return (
    <div className="min-h-screen p-4 pb-20 max-w-sm mx-auto flex flex-col gap-6">
      {/* Hero */}
      <div className="text-center mt-4">
        <span className="text-5xl">🎁</span>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
          Invite Friends & Earn
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Get <span className="text-gold font-bold">5,000 points</span> for every friend who joins.
          <br />
          <span className="text-yellow-300 font-semibold">🎉 Massive bonuses when they upgrade!</span>
        </p>
      </div>

      {/* Invite Count */}
      <div className="glass rounded-2xl p-6 text-center border border-gold/20 shadow-lg shadow-gold/10">
        <p className="text-gray-400 text-sm">👥 Total Invites</p>
        <p className="text-4xl font-bold text-gold mt-1">{stats.invites || 0}</p>
      </div>

      {/* Referral Link */}
      <div className="glass rounded-2xl p-6 border border-gray-700">
        <p className="text-sm text-gray-400 mb-3">🔗 Your invite link</p>
        <div className="bg-black/30 rounded-xl p-3 mb-4">
          <p className="text-xs text-gray-300 font-mono break-all select-all">
            {referralLink}
          </p>
        </div>
        <button
          onClick={copyLink}
          className={`w-full py-3 rounded-xl font-bold text-lg transition transform hover:scale-[1.02] ${
            copied
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-gold to-amber-600 text-black shadow-lg shadow-gold/20"
          }`}
        >
          {copied ? "✅ Copied!" : "📋 Copy Invite Link"}
        </button>
      </div>

      {/* Bonus Table */}
      <div className="glass rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          🚀 Upgrade Bonuses
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          When your invited friend upgrades their membership, you receive:
        </p>
        <div className="flex flex-col gap-2">
          {BONUS_TABLE.map((row) => (
            <div
              key={row.level}
              className="flex items-center justify-between bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{row.emoji}</span>
                <span className={`text-sm font-medium ${row.color}`}>{row.level}</span>
              </div>
              <span className="text-sm font-bold text-gold">{row.points} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          🏆 Leaderboard
        </h3>
        {stats.leaderboard?.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">No invites yet. Be the first!</p>
        )}
        {stats.leaderboard?.map((entry: any, idx: number) => (
          <div
            key={entry.telegram_id}
            className={`flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0 ${
              idx < 3 ? "bg-white/5 -mx-4 px-4 rounded-lg" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {getMedal(idx) ? (
                <span className="text-2xl">{getMedal(idx)}</span>
              ) : (
                <span className="text-sm text-gray-500 w-8 text-center">{idx + 1}</span>
              )}
              <div>
                <p className="text-sm font-medium text-white">
                  {entry.name || entry.username || "Anonymous"}
                </p>
                {entry.username && <p className="text-xs text-gray-500">@{entry.username}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gold">{entry.invites}</p>
              <p className="text-xs text-gray-500">invites</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-gray-700 text-xs">
        🔒 Bonuses are credited automatically after admin approval.
      </div>
    </div>
  );
}
