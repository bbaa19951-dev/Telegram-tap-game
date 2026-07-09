// src/App.tsx
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Referral from "./pages/Referral";
import Withdraw from "./pages/Withdraw";
import AdminPanel from "./pages/AdminPanel";
import LoadingSpinner from "./components/LoadingSpinner";
import MainLayout from "./components/MainLayout";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/" replace />;
  return <MainLayout />;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/withdraw" element={<Withdraw />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
