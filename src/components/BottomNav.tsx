// src/components/BottomNav.tsx
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gray-700 flex justify-around py-3 z-50">
      <Link
        to="/home"
        className={`flex flex-col items-center text-xs ${
          location.pathname === "/home" ? "text-gold" : "text-gray-400"
        }`}
      >
        🏠<span>Home</span>
      </Link>

      <Link
        to="/referral"
        className={`flex flex-col items-center text-xs ${
          location.pathname === "/referral" ? "text-gold" : "text-gray-400"
        }`}
      >
        👥<span>Referral</span>
      </Link>

      <Link
        to="/shop"
        className={`flex flex-col items-center text-xs ${
          location.pathname === "/shop" ? "text-gold" : "text-gray-400"
        }`}
      >
        🛍️<span>Shop</span>
      </Link>

      <Link
        to="/withdraw"
        className={`flex flex-col items-center text-xs ${
          location.pathname === "/withdraw" ? "text-gold" : "text-gray-400"
        }`}
      >
        💸<span>Withdraw</span>
      </Link>
    </nav>
  );
}
