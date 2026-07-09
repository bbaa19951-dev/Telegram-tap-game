// src/lib/api.ts

const AUTH_URL = import.meta.env.VITE_AUTH_FUNCTION_URL;

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface AuthResponse {
  token: string;
  user: TelegramUser;
}

export async function authenticateTelegram(initData: string): Promise<AuthResponse> {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  });

  if (!res.ok) {
    const err = await res.json();const DAILY_REWARD_URL = import.meta.env.VITE_DAILY_REWARD_FUNCTION_URL;
const AUTO_TAP_URL = import.meta.env.VITE_AUTO_TAP_FUNCTION_URL;

export async function claimDailyReward(token: string) {
  const res = await fetch(DAILY_REWARD_URL, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}

export async function claimAutoTap(token: string) {
  const res = await fetch(AUTO_TAP_URL, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}
    throw new Error(err.error || "Authentication failed");
  }

  return res.json();
}

// Helper to create headers with JWT for future authenticated requests
export function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}const PROFILE_URL = import.meta.env.VITE_PROFILE_FUNCTION_URL;
const TAP_URL = import.meta.env.VITE_TAP_FUNCTION_URL;

interface Profile {
  telegram_id: number;
  membership_level: string;
  total_points: number;
  energy: number;
  max_energy: number;
  tap_count_today: number;
  points_today: number;
}

export async function getProfile(token: string): Promise<Profile> {
  const res = await fetch(PROFILE_URL, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}

export async function sendTaps(token: string, tapCount: number) {
  const res = await fetch(TAP_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ tap_count: tapCount }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}
