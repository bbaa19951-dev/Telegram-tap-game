// src/components/MainLayout.tsx
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  loading?: boolean;
}

export default function MainLayout({ loading }: Props) {
  return (
    <div className="pb-16">
      {loading ? <LoadingSpinner /> : <Outlet />}
      <BottomNav />
    </div>
  );
}
