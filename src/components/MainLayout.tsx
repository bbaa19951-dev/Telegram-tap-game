// src/components/MainLayout.tsx
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function MainLayout() {
  return (
    <div className="pb-16">
      <Outlet />
      <BottomNav />
    </div>
  );
}
