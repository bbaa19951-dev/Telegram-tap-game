// src/pages/AdminPanel.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getAdminStats,
  getAdminUsers,
  banUser,
  unbanUser,
  getAdminPayments,
  processPayment,
  getAdminWithdrawals,
  processWithdrawal,
  getAdStats,
} from "../lib/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminPanel() {
  const { token } = useAuth();
  const [tab, setTab] = useState<"stats" | "users" | "payments" | "withdrawals" | "ads">("stats");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [adStats, setAdStats] = useState<any>(null);
  const [searchUser, setSearchUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAdminStats(token)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (tab === "users") getAdminUsers(token, searchUser).then(res => setUsers(res.users)).catch(console.error);
    else if (tab === "payments") getAdminPayments(token).then(res => setPayments(res.payments)).catch(console.error);
    else if (tab === "withdrawals") getAdminWithdrawals(token).then(res => setWithdrawals(res.withdrawals)).catch(console.error);
    else if (tab === "ads") getAdStats(token).then(res => setAdStats(res)).catch(console.error);
  }, [tab, token, searchUser]);

  const handleBanToggle = async (userId: string, isBanned: boolean) => {
    if (!token) return;
    await (isBanned ? unbanUser(token, userId) : banUser(token, userId));
    getAdminUsers(token, searchUser).then(res => setUsers(res.users));
  };

  const handlePaymentAction = async (paymentId: string, action: "approve" | "reject") => {
    if (!token) return;
    await processPayment(token, paymentId, action);
    getAdminPayments(token).then(res => setPayments(res.payments));
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: "approve" | "reject") => {
    if (!token) return;
    await processWithdrawal(token, withdrawalId, action);
    getAdminWithdrawals(token).then(res => setWithdrawals(res.withdrawals));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gold mb-4">Admin Panel</h1>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["stats", "users", "payments", "withdrawals", "ads"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-3 py-1 rounded-lg text-sm ${tab === t ? "bg-gold text-black" : "bg-gray-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "stats" && stats && (
        <div className="glass rounded-xl p-4 grid grid-cols-2 gap-3">
          <div>Total Users: {stats.totalUsers}</div>
          <div>Active Today: {stats.activeUsers}</div>
          <div>New Today: {stats.newUsersToday}</div>
          <div>Revenue (ETB): {stats.totalRevenue}</div>
          <div>Taps Today: {stats.tapsToday}</div>
          <div>Pending Payments: {stats.pendingPayments}</div>
          <div>Pending Withdrawals: {stats.pendingWithdrawals}</div>
        </div>
      )}

      {tab === "users" && (
        <div>
          <input
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
            placeholder="Search users"
            className="w-full p-2 rounded-lg bg-gray-800 text-white mb-3"
          />
          {users.map(u => (
            <div key={u.telegram_id} className="flex justify-between items-center glass rounded-lg p-3 mb-2">
              <div>
                <p>{u.first_name} {u.last_name || ""}</p>
                <p className="text-xs text-gray-400">@{u.username}</p>
                <p className="text-xs">Ban: {u.is_banned ? "Yes" : "No"}</p>
              </div>
              <button
                onClick={() => handleBanToggle(u.telegram_id.toString(), u.is_banned)}
                className={`px-3 py-1 rounded ${u.is_banned ? "bg-green-600" : "bg-red-600"}`}
              >
                {u.is_banned ? "Unban" : "Ban"}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "payments" && (
        <div>
          {payments.map(p => (
            <div key={p.id} className="glass rounded-lg p-3 mb-2 flex justify-between items-center">
              <div>
                <p>User: {p.users?.first_name || p.user_id}</p>
                <p className="text-xs">Amount: {p.amount} ETB</p>
                <p className="text-xs">Status: {p.status}</p>
              </div>
              {p.status === "pending" && (
                <div className="flex gap-1">
                  <button onClick={() => handlePaymentAction(p.id, "approve")} className="bg-green-600 px-2 py-1 rounded text-sm">Approve</button>
                  <button onClick={() => handlePaymentAction(p.id, "reject")} className="bg-red-600 px-2 py-1 rounded text-sm">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "withdrawals" && (
        <div>
          {withdrawals.map(w => (
            <div key={w.id} className="glass rounded-lg p-3 mb-2 flex justify-between items-center">
              <div>
                <p>User: {w.users?.first_name || w.user_id}</p>
                <p className="text-xs">Points: {w.points} (Fee: {w.fee_points})</p>
                <p className="text-xs">Status: {w.status}</p>
              </div>
              {w.status === "pending" && (
                <div className="flex gap-1">
                  <button onClick={() => handleWithdrawalAction(w.id, "approve")} className="bg-green-600 px-2 py-1 rounded text-sm">Approve</button>
                  <button onClick={() => handleWithdrawalAction(w.id, "reject")} className="bg-red-600 px-2 py-1 rounded text-sm">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "ads" && adStats && (
        <div className="glass rounded-xl p-4">
          <div>Total Ad Views: {adStats.totalViews}</div>
          <div>Completed Today: {adStats.completedToday}</div>
          <div>Total Rewarded Points: {adStats.totalRewarded}</div>
          <div>Est. Revenue (ETB): {adStats.estimatedRevenue}</div>
        </div>
      )}
    </div>
  );
  }
