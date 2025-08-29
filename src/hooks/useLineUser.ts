import { useEffect, useState } from "react";
import axios from "axios";

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_BASE_URL;

export function useLineUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // liffオブジェクトからline_idを取得（LIFF SDKがwindow.liffとしてグローバルに存在する前提）
        let line_id = "";
        if (typeof window !== "undefined" && (window as any).liff && (window as any).liff.isLoggedIn()) {
          const profile = await (window as any).liff.getProfile();
          line_id = profile.userId;
        } else {
          // ローカル開発や未ログイン時の仮ID
          line_id = "Ua08801bcbe21d7c2985ed58d24006472";
        }
        const res = await axios.post(
          `${WP_BASE_URL}/wp-json/custom/v1/me`,
          { line_id },
          { headers: { "Content-Type": "application/json" } }
        );
        if (res.data && res.data.id) setUser(res.data);
        else setUser(null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading };
}
