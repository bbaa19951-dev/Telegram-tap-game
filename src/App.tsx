// src/App.tsx
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Referral from "./pages/Referral";
import Withdraw from "./pages/Withdraw";
import Shop from "./pages/Shop";
import AdminPanel from "./pages/AdminPanel";
import LoadingSpinner from "./components/LoadingSpinner";
import MainLayout from "./components/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteErrorBoundary from "./components/RouteErrorBoundary";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <MainLayout loading={true} />;
  if (!user) return <Navigate to="/" replace />;
  return <MainLayout />;
}

function AppContent() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            <RouteErrorBoundary name="Login">
              <Login />
            </RouteErrorBoundary>
          }
        />
        <Route element={<ProtectedLayout />}>
          <Route
            path="/home"
            element={
              <RouteErrorBoundary name="Home">
                <Home />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/referral"
            element={
              <RouteErrorBoundary name="Referral">
                <Referral />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/withdraw"
            element={
              <RouteErrorBoundary name="Withdraw">
                <Withdraw />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/shop"
            element={
              <RouteErrorBoundary name="Shop">
                <Shop />
              </RouteErrorBoundary>
            }
          />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RouteErrorBoundary name="AdminPanel">
                <AdminPanel />
              </RouteErrorBoundary>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
