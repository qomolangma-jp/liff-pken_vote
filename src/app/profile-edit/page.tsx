"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../components/TopPage.module.css";
import { useLineUser } from "@/hooks/useLineUser";

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_BASE_URL;

export default function ProfileEditPage() {
  const { user, loading } = useLineUser();
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    email: "",
  });
  const [saved, setSaved] = useState(false);

  // user情報が取得できたらformに反映
  useEffect(() => {
    if (user) {
      setForm({
        lastName: user.last_name || "",
        firstName: user.first_name || "",
        lastNameKana: user.last_kana || "",
        firstNameKana: user.first_kana || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ここでプロフィール更新APIを呼ぶ（API実装が必要）
    setSaved(true);
  };

  if (loading) return <main className={styles.main}>読み込み中...</main>;

  return (
    <main className={styles.main}>
      <h2 className={styles.sectionTitle}>プロフィール編集</h2>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>氏</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>名</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>カナ（氏）</label>
          <input
            type="text"
            name="lastNameKana"
            value={form.lastNameKana}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>カナ（名）</label>
          <input
            type="text"
            name="firstNameKana"
            value={form.firstNameKana}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>メールアドレス</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          保存
        </button>
        {saved && <div style={{ color: "#1976d2", marginTop: "1rem" }}>保存しました</div>}
      </form>
    </main>
  );
}