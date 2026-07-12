// src/pages/Home.tsx
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getProfile,
  sendTaps,
  claimDailyReward,
  claimAutoTap,
  claimAdReward,
  getAppSettings,
} from "../lib/api";
import LoadingSpinner from "../components/LoadingSpinner";
import BottomNav from "../components/BottomNav";

const MAX_TAPS = 5000;
const TAP_BATCH_SIZE = 10;

export default function Home() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [localTaps, setLocalTaps] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [claimingDaily, setClaimingDaily] = useState(false);
  const [claimingAuto, setClaimingAuto] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  // HARDCODED IMAGE URL FOR TESTING – REMOVE THIS LATER
  const hardcodedUrl =
    "https://xlmkianuhbqssfelnpiq.supabase.co/storage/v1/object/public/assets/file_00000000ce547230a28689e0654b2ca6.png";
  const [tapImage, setTapImage] = useState<string | null>(hardcodedUrl);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setProfileError("");
    try {
      const data = await getProfile(token);
      setProfile(data);
    } catch (err: any) {
      setProfileError(err.message);
    }
  }, [token]);

  // Fetch app settings (will be used after we remove hardcode)
  useEffect(() => {
    getAppSettings()
      .then((settings) => {
        if (settings.tap_image_url) setTapImage(settings.tap_image_url);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const syncTaps = useCallback(async () => {
    if (localTaps <= 0 || !token || isSending) return;
    setIsSending(true);
    try {
      const result = await sendTaps(token, localTaps);
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

  useEffect(() => {
    if (localTaps >= TAP_BATCH_SIZE) syncTaps();
    const timeout = setTimeout(() => {
      if (localTaps > 0) syncTaps();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [localTaps, syncTaps]);

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

  const handleTap = () => {
    if (!profile) return;
    if (profile.tap_count_today + localTaps >= MAX_TAPS) {
      alert("Daily tap limit reached");
      return;
    }
    if (profile.energy <= 0) {
      alert("No energy left");
      return;
    }
    setProfile((prev: any) => ({
      ...prev,
      energy: prev.energy - 1,
      total_points: prev.total_points + multiplierFromLevel(prev.membership_level),
    }));
    setLocalTaps((prev) => prev + 1);
  };

  const handleDailyReward = async () => {
    if (!token || claimingDaily) return;
    setClaimingDaily(true);
    try {
      const res = await claimDailyReward(token);
      setProfile((prev: any) => ({
        ...prev,
        total_points: res.new_balance,
        daily_reward_claimed: true,
      }));
      alert(`+${res.points_earned.toLocaleString()} points!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setClaimingDaily(false);
    }
  };

  const handleAutoTap = async () => {
    if (!token || claimingAuto) return;
    setClaimingAuto(true);
    try {
      const res = await claimAutoTap(token);
      setProfile((prev: any) => ({
        ...prev,
        total_points: res.new_balance,
        auto_tap_pending: 0,
      }));
      alert(`+${res.points_claimed.toLocaleString()} auto tap points!`);
      fetchProfile();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setClaimingAuto(false);
    }
  };

  const handleAd = async () => {
    if (!token || adLoading) return;
    setAdLoading(true);
    try {
      const res = await claimAdReward(token);
      setProfile((prev: any) => ({
        ...prev,
        total_points: res.new_balance,
      }));
      alert(`+${res.points_earned} ad points!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdLoading(false);
    }
  };

  // ---------- ERROR STATE WITH LOGOUT BUTTON ----------
  if (profileError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="glass rounded-xl p-6 text-center max-w-sm">
          <p className="text-red-400 mb-4">Failed to load profile</p>
          <pre className="text-xs text-gray-400 mb-4 whitespace-pre-wrap">
            {profileError}
          </pre>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.hash = "";
              window.location.reload();
            }}
            className="bg-gold text-black px-4 py-2 rounded-lg"
          >
            Logout & Reload
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return <LoadingSpinner />;

  return (
    <div className="min-h-screen p-4 pb-20 flex flex-col items-center gap-4">
      {/* Points & Level */}
      <div className="w-full max-w-sm glass rounded-2xl p-6 text-center">
        <div className="text-sm text-gray-400">Membership</div>
        <div className="text-xl font-bold text-gold">
          {profile.membership_level}
        </div>
        <div className="text-3xl font-bold mt-2">
          {Math.floor(
            profile.total_points +
              localTaps * multiplierFromLevel(profile.membership_level)
          ).toLocaleString()}
        </div>
        <div className="text-sm text-gray-300">Points</div>
      </div>

      {/* Energy & Taps */}
      <div className="w-full max-w-sm glass rounded-xl p-4">
        <div className="flex justify-between text-sm mb-1">
          <span>⚡ Energy</span>
          <span>
            {profile.energy}/{profile.max_energy}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full"
            style={{ width: `${(profile.energy / profile.max_energy) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Taps today: {profile.tap_count_today + localTaps}/{MAX_TAPS}
        </div>
      </div>

      {/* DEBUG LINE */}
      <p className="text-xs text-white text-center mt-2">
        Tap image: {tapImage || "none"}
      </p>

      {/* Tap Button */}
      <button
        onClick={handleTap}
        disabled={isSending}
        className="w-36 h-36 rounded-full flex items-center justify-center active:scale-95 transition select-none focus:outline-none shadow-2xl overflow-hidden"
        style={
          tapImage
            ? {
                backgroundImage: `url(${tapImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background: "linear-gradient(to bottom, #facc15, #d97706)",
              }
        }
      >
        {!tapImage && (
          <span className="text-3xl font-black text-black">TAP</span>
        )}
      </button>

      {/* Rewards Section */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {/* Daily Reward */}
        <button
          onClick={handleDailyReward}
          disabled={
            profile.daily_reward_claimed ||
            claimingDaily ||
            profile.membership_level === "Free"
          }
          className={`w-full py-3 rounded-xl font-semibold ${
            profile.daily_reward_claimed || profile.membership_level === "Free"
              ? "bg-gray-700 text-gray-400"
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          {profile.membership_level === "Free"
            ? "Daily Reward (Premium Only)"
            : profile.daily_reward_claimed
              ? "Daily Reward Claimed ✓"
              : claimingDaily
                ? "Claiming..."
                : "Claim Daily Reward"}
        </button>

        {/* Auto Tap */}
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-sm text-gray-400 mb-1">Auto Tap Pending</div>
          <div className="text-xl font-bold">
            {profile.auto_tap_pending?.toLocaleString() || "0"} points
          </div>
          <button
            onClick={handleAutoTap}
            disabled={
              profile.auto_tap_pending <= 0 ||
              claimingAuto ||
              profile.membership_level === "Free"
            }
            className={`mt-2 w-full py-2 rounded-lg text-sm font-semibold ${
              profile.auto_tap_pending > 0 &&
              profile.membership_level !== "Free"
                ? "bg-purple-600 text-white hover:bg-purple-500"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {profile.membership_level === "Free"
              ? "Auto Tap (Premium Only)"
              : claimingAuto
                ? "Claiming..."
                : "Claim Auto Tap"}
          </button>
        </div>

        {/* Watch Ad Button */}
        <button
          onClick={handleAd}
          disabled={adLoading || profile.membership_level === "Free"}
          className={`w-full py-3 rounded-xl font-semibold ${
            profile.membership_level === "Free"
              ? "bg-gray-700 text-gray-400"
              : "bg-orange-600 text-white hover:bg-orange-500"
          }`}
        >
          {adLoading ? "Verifying..." : "🎥 Watch Ad & Earn"}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
