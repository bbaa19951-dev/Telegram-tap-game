// src/App.tsx

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LoadingSpinner from "./components/LoadingSpinner";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Login />;
  return <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
