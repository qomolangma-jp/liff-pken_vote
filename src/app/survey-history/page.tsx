"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "@/components/TopPage.module.css";
import { useLineUser } from "@/hooks/useLineUser";

export default function SurveyHistoryPage() {
  const { user, loading } = useLineUser();
  type SurveyHistoryItem = {
    id: number;
    title: string;
    date: string;
  };
  const [history, setHistory] = useState<SurveyHistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`/wp-api/custom/v1/survey_history`, {
        params: { user_id: user.id },
      })
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]));
  }, [user]);

  if (!user) return <main className={styles.main}>ログイン情報がありません。</main>;
  if (loading) return <main className={styles.main}>読み込み中...</main>;

  return (
    <main className={styles.main}>
      <h2 className={styles.sectionTitle}>アンケート履歴</h2>
      {history.length === 0 ? (
        <div className={styles.historyEmpty}>履歴はありません。</div>
      ) : (
        <ul className={styles.historyList}>
          {history.map((item: SurveyHistoryItem, idx: number) => (
            <li key={idx} className={styles.historyItem}>
              <Link href={`/survey-detail?id=${item.id}`}>
                {item.title}（{item.date}）
              </Link>
            </li>
          ))}
        </ul>        
      )}
    </main>
  );
}