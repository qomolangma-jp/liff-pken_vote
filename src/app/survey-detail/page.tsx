"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../components/TopPage.module.css";
import { useLineUser } from "@/hooks/useLineUser";
import { useSearchParams } from "next/navigation";

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_BASE_URL;

export default function SurveyDetailPage() {
  const { user, loading } = useLineUser();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [detail, setDetail] = useState<any>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    setFetching(true);
    axios
      .get(`${WP_BASE_URL}/wp-json/custom/v1/survey_detail`, {
        params: { user_id: user.id, survey_id: id },
      })
      .then((res) => setDetail(res.data))
      .catch(() => setDetail(null))
      .finally(() => setFetching(false));
  }, [user, id]);

  if (loading || fetching) {
    return <main className={styles.main}>読み込み中...</main>;
  }
  if (!detail) {
    return <main className={styles.main}>詳細情報が取得できませんでした。</main>;
  }

  return (
    <main className={styles.main}>
      <h2 className={styles.sectionTitle}>アンケート詳細</h2>
      <div>
        <div>タイトル: {detail.title}</div>
        <div>日付: {detail.date}</div>
        <div>内容: {detail.content}</div>
        {/* 必要に応じて他の情報も表示 */}
      </div>
    </main>
  );
}