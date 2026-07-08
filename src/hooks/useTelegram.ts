import { useEffect, useState } from "react";

interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  initData: string;
  initDataUnsafe: {
    user?: TgUser;
    query_id?: string;
  };
}

export function useTelegram() {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TgUser | null>(null);
  const [initData, setInitData] = useState<string>("");

  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp as TelegramWebApp | undefined;
    if (webApp) {
      setTg(webApp);
      setInitData(webApp.initData);
      setUser(webApp.initDataUnsafe?.user ?? null);
    }
  }, []);

  return { tg, user, initData };
}
