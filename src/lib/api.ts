// src/lib/api.ts

// -----------------------------------------------
// Base URLs – hard‑coded where necessary to avoid
// missing Vercel environment variables
// -----------------------------------------------
const AUTH_URL = "https://xlmkianuhbqssfelnpiq.supabase.co/functions/v1/auth-telegram";
const PROFILE_URL = import.meta.env.VITE_PROFILE_FUNCTION_URL;
const TAP_URL = import.meta.env.VITE_TAP_FUNCTION_URL;
const DAILY_REWARD_URL = import.meta.env.VITE_DAILY_REWARD_FUNCTION_URL;
const AUTO_TAP_URL = import.meta.env.VITE_AUTO_TAP_FUNCTION_URL;
const REFERRAL_STATS_URL = import.meta.env.VITE_REFERRAL_STATS_URL;
const ADMIN_STATS_URL = import.meta.env.VITE_ADMIN_STATS_URL;
const ADMIN_USERS_URL = import.meta.env.VITE_ADMIN_USERS_URL;
const ADMIN_WITHDRAWALS_URL = import.meta.env.VITE_ADMIN_WITHDRAWALS_URL;
const REQUEST_WITHDRAWAL_URL = import.meta.env.VITE_REQUEST_WITHDRAWAL_URL;
const GET_WITHDRAWALS_URL = import.meta.env.VITE_GET_WITHDRAWALS_URL;
const AD_REWARD_URL = import.meta.env.VITE_AD_REWARD_URL;
const AD_STATS_URL = import.meta.env.VITE_AD_STATS_URL;

// 🔧 Hard‑coded for immediate functionality
const ADMIN_PAYMENTS_URL = "https://xlmkianuhbqssfelnpiq.supabase.co/functions/v1/admin-payments";
const SUBMIT_PAYMENT_URL = "https://xlmkianuhbqssfelnpiq.supabase.co/functions/v1/submit-payment";
const APP_SETTINGS_URL = "https://xlmkianuhbqssfelnpiq.supabase.co/functions/v1/app-settings";

// -----------------------------------------------
// Types
// -----------------------------------------------
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

interface Profile {
  telegram_id: number;
  membership_level: string;
  total_points: number;
  energy: number;
  max_energy: number;
  tap_count_today: number;
  points_today: number;
  auto_tap_pending?: number;
  daily_reward_claimed?: boolean;
  is_admin?: boolean;
}

// -----------------------------------------------
// Helpers
// -----------------------------------------------
export function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// -----------------------------------------------
// Request wrapper – auto‑logout on 401
// -----------------------------------------------
async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, options);

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.hash = "";
    window.location.reload();
    throw new Error("Session expired. Please log in again.");
  }

  return res;
}

// -----------------------------------------------
// Auth
// -----------------------------------------------
export async function authenticateTelegram(
  initData: string,
  referralCode?: string
): Promise<AuthResponse> {
  const body: any = { initData };
  if (referralCode) body.referral_code = referralCode;

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Authentication failed");
  }

  return res.json();
}

// -----------------------------------------------
// Profile & Game
// -----------------------------------------------
export async function getProfile(token: string): Promise<Profile> {
  const res = await apiFetch(PROFILE_URL, { headers: authHeaders(token) });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}

export async function sendTaps(token: string, tapCount: number) {
  const res = await apiFetch(TAP_URL, {
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

export async function claimDailyReward(token: string) {
  const res = await apiFetch(DAILY_REWARD_URL, {
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
  const res = await apiFetch(AUTO_TAP_URL, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}

// -----------------------------------------------
// Referral
// -----------------------------------------------
export async function getReferralStats(token: string) {
  const res = await apiFetch(REFERRAL_STATS_URL, { headers: authHeaders(token) });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}

// -----------------------------------------------
// Admin APIs
// -----------------------------------------------
export async function getAdminStats(token: string) {
  const res = await apiFetch(ADMIN_STATS_URL, { headers: authHeaders(token) });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getAdminUsers(token: string, search?: string) {
  const url = new URL(ADMIN_USERS_URL);
  if (search) url.searchParams.set("search", search);
  const res = await apiFetch(url.toString(), { headers: authHeaders(token) });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function banUser(token: string, userId: string) {
  const url = new URL(ADMIN_USERS_URL);
  url.searchParams.set("action", "ban");
  url.searchParams.set("user_id", userId);
  const res = await apiFetch(url.toString(), { method: "POST", headers: authHeaders(token) });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function unbanUser(token: string, userId: string) {
  const url = new URL(ADMIN_USERS_URL);
  url.searchParams.set("action", "unban");
  url.searchParams.set("user_id", userId);
  const res = await apiFetch(url.toString(), { method: "POST", headers: authHeaders(token) });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getAdminPayments(token: string) {
  const res = await apiFetch(ADMIN_PAYMENTS_URL, { headers: authHeaders(token) });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function processPayment(
  token: string,
  paymentId: string,
  action: "approve" | "reject",
  level?: string
) {
  const res = await apiFetch(ADMIN_PAYMENTS_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ paymentId, action, level }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getAdminWithdrawals(token: string) {
  const res = await apiFetch(ADMIN_WITHDRAWALS_URL, { headers: authHeaders(token) });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function processWithdrawal(
  token: string,
  withdrawalId: string,
  action: "approve" | "reject"
) {
  const res = await apiFetch(ADMIN_WITHDRAWALS_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ withdrawalId, action }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// -----------------------------------------------
// User Withdrawal APIs
// -----------------------------------------------
export async function requestWithdrawal(
  token: string,
  points: number,
  bankDetails: string
) {
  const res = await apiFetch(REQUEST_WITHDRAWAL_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ points, bank_details: bankDetails }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getUserWithdrawals(token: string) {
  const res = await apiFetch(GET_WITHDRAWALS_URL, { headers: authHeaders(token) });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// -----------------------------------------------
// Ad Reward & Stats
// -----------------------------------------------
export async function claimAdReward(token: string) {
  const res = await apiFetch(AD_REWARD_URL, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getAdStats(token: string) {
  const res = await apiFetch(AD_STATS_URL, { headers: authHeaders(token) });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// -----------------------------------------------
// Membership (Shop)
// -----------------------------------------------
export async function submitPayment(token: string, level: string, proof: string) {
  const res = await apiFetch(SUBMIT_PAYMENT_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ level, proof }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// -----------------------------------------------
// App Settings (bank details, tap image, etc.)
// -----------------------------------------------
export async function getAppSettings(): Promise<{
  bank_details: string;
  tap_image_url: string | null;
}> {
  const res = await fetch(APP_SETTINGS_URL);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}
