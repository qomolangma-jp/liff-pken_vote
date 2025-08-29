import { useEffect, useState } from "react";
import axios from "axios";

interface LineUser {
  id: number;
  name?: string;
  last_name?: string;
  first_name?: string;
  last_kana?: string;
  first_kana?: string;
  email?: string;
  line_id: string;
  // 必要に応じて他のプロパティを追加
}

// window.liff型ガード
function isLiffAvailable(obj: unknown): obj is { liff: { isLoggedIn: () => boolean; getProfile: () => Promise<{ userId: string }> } } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "liff" in obj &&
    typeof (obj as { liff: unknown }).liff === "object" &&
    (obj as { liff: { isLoggedIn?: unknown; getProfile?: unknown } }).liff !== null &&
    typeof (obj as { liff: { isLoggedIn?: unknown } }).liff.isLoggedIn === "function" &&
    typeof (obj as { liff: { getProfile?: unknown } }).liff.getProfile === "function"
  );
}

export function useLineUser() {
  const [user, setUser] = useState<LineUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      let line_id = "";

      try {
        // liffオブジェクトからline_idを取得（LIFF SDKがwindow.liffとしてグローバルに存在する前提）
        if (
          typeof window !== "undefined" &&
          isLiffAvailable(window) &&
          window.liff.isLoggedIn()
        ) {
          const profile = await window.liff.getProfile();
          line_id = profile.userId;
        } else {
          // ローカル開発や未ログイン時の仮ID
          line_id = "Ua08801bcbe21d7c2985ed58d24006472XXX";
        }
        try {
          const res = await axios.post(
            "/wp-api/custom/v1/me",
            { line_id },
            { headers: { "Content-Type": "application/json" } }
          );
          if (res.data && res.data.id) {
            setUser({ ...res.data, line_id });
          } else {
            // line_idだけは必ずセット
            console.log('setline_id:', line_id);
            setUser({ id: 0, line_id });
          }
        } catch (error) {
          console.error('API Error:', error);
          setUser({ id: 0, line_id });
        }
      } catch (fetchError) {
        console.error('useLineUser Error:', fetchError);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading };
}
