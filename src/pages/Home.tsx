// src/pages/Home.tsx

import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-4">
      <div className="glass rounded-2xl p-6 text-center">
        <h2 className="text-xl font-bold text-gold">Welcome, {user?.first_name}!</h2>
        <p className="text-gray-300 mt-2">Your points: 0</p>
        <button
          onClick={logout}
          className="mt-4 bg-red-500/20 text-red-300 py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </div>
      <p className="text-center text-gray-500 mt-8">Game mechanics coming soon...</p>
    </div>
  );
}
