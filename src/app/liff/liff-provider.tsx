'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import liff from '@line/liff';

type LiffState = { ready: boolean; profile?: any; error?: string; mock?: boolean; };
const Ctx = createContext<LiffState>({ ready:false });
export const useLiffCtx = () => useContext(Ctx);

export default function LiffProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LiffState>({ ready:false });

  useEffect(() => {
    const enabled = process.env.NEXT_PUBLIC_LIFF_ENABLED !== 'false';
    if (!enabled) {
      // ローカル：LIFFを完全スキップ（モック）
      setState({
        ready: true,
        mock: true,
        profile: { displayName: 'Local User', userId: 'local-000' },
      });
      return;
    }

    (async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID!;
        await liff.init({ liffId });
        if (!liff.isLoggedIn()) {
          await liff.login({ redirectUri: window.location.href });
          return;
        }
        const profile = await liff.getProfile();
        setState({ ready:true, profile });
      } catch (e:any) {
        setState({ ready:false, error: String(e?.message ?? e) });
      }
    })();
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
