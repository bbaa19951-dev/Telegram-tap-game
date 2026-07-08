import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";

function App() {
  const { tg, user } = useTelegram();

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, [tg]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gold mb-2">Tap to Earn</h1>
        {user ? (
          <p>Welcome, {user.first_name}!</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;
