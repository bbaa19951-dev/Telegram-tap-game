// src/pages/Home.tsx
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";
import { getProfile, sendTaps } from "../lib/api";
import { useEffect, useState, useCallback } from "react";

const MAX_TAPS = 5000;
const TAP_BATCH_SIZE = 10; // send to server every 10 taps

export default function Home() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [localTaps, setLocalTaps] = useState(0);
  const [isSending, setIsSending] = useState(false);

  // Fetch user data
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getProfile(token);
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Send accumulated taps to server
  const syncTaps = useCallback(async () => {
    if (localTaps <= 0 || !token || isSending) return;
    setIsSending(true);
    try {
      const result = await sendTaps(token, localTaps);
      // Update profile with new balance and energy from server
      setProfile((prev: any) => ({
        ...prev,
        total_points: result.new_balance,
        energy: result.energy_remaining,
        tap_count_today: result.tap_count_today,
      }));
      setLocalTaps(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  }, [localTaps, token, isSending]);

  // Auto-sync when localTaps reaches BATCH_SIZE or user stops tapping (debounce)
  useEffect(() => {
    if (localTaps >= TAP_BATCH_SIZE) {
      syncTaps();
    }
    const timeout = setTimeout(() => {
      if (localTaps > 0) syncTaps();
    }, 3000); // sync after 3 seconds of inactivity
    return () => clearTimeout(timeout);
  }, [localTaps, syncTaps]);

  const handleTap = () => {
    if (!profile) return;
    if (profile.tap_count_today + localTaps >= MAX_TAPS) {
      alert("Daily tap limit reached");
      return;
    }
    if (profile.energy <= 0) {
      alert("No energy left. Wait for it to recharge.");
      return;
    }
    // Optimistic update
    setProfile((prev: any) => ({
      ...prev,
      energy: prev.energy - 1,
      total_points: prev.total_points + (multiplierFromLevel(prev.membership_level)),
    }));
    setLocalTaps((prev) => prev + 1);
  };

  // Compute multiplier based on membership (for optimistic display)
  const multiplierFromLevel = (level: string): number => {
    const m: Record<string, number> = {
      Free: 0,
      Wood: 3.33,
      Bronze: 9.99,
      Silver: 33.3,
      Gold: 66.6,
      Diamond: 99.9,
      Legend: 199.8,
    };
    return m[level] || 0;
  };

  if (!profile) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      {/* Points & Level */}
      <div className="w-full max-w-sm glass rounded-2xl p-6 mb-4 text-center">
        <div className="text-sm text-gray-400">Membership</div>
        <div className="text-xl font-bold text-gold">{profile.membership_level}</div>
        <div className="text-3xl font-bold mt-2">
          {Math.floor(profile.total_points + localTaps * multiplierFromLevel(profile.membership_level)).toLocaleString()}
        </div>
        <div className="text-sm text-gray-300">Points</div>
      </div>

      {/* Energy Bar */}
      <div className="w-full max-w-sm glass rounded-xl p-4 mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>⚡ Energy</span>
          <span>{profile.energy}/{profile.max_energy}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full"
            style={{ width: `${(profile.energy / profile.max_energy) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-2">Taps today: {profile.tap_count_today + localTaps}/{MAX_TAPS}</div>
      </div>

      {/* Tap Button */}
      <button
        onClick={handleTap}
        disabled={isSending}
        className="w-40 h-40 rounded-full bg-gradient-to-b from-yellow-400 to-amber-600 shadow-2xl flex items-center justify-center text-4xl font-black text-black active:scale-95 transition transform duration-75 select-none focus:outline-none"
      >
        TAP
      </button>

      <div className="mt-6">
        <button onClick={logout} className="text-sm text-gray-500 underline">
          Logout
        </button>
      </div>
    </div>
  );
      }
