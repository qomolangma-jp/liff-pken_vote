"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import styles from './TopPage.module.css';
import Link from 'next/link';
import { useLineUser } from "@/hooks/useLineUser";

const grades = [
  { label: '1年', value: 1 },
  { label: '2年', value: 2 },
  { label: '3年', value: 3 }
];
const classes = Array.from({ length: 9 }, (_, i) => ({ label: `${i + 1}組`, value: i + 1 }));

export default function TopPage() {
  const { user, loading } = useLineUser();
  console.log('User:', user);

  const [form, setForm] = useState({
    grade: '',
    class: '',
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // ...user, loadingはuseLineUserから取得するため、fetchUserやsetUser/setLoadingのローカル管理は不要...

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sendData = {
      ...form,
      grade: Number(form.grade),
      class: Number(form.class),
      line_id: user?.line_id || ''
    };

    const rawBody = JSON.stringify(sendData); // bodyはAPIに送るオブジェクト
    const signature = CryptoJS.HmacSHA256(
      rawBody,
      process.env.NEXT_PUBLIC_CUR_SHARED_SECRET || ""
    ).toString();    

    console.log("生成された署名:", signature);
    console.log("NEXT_PUBLIC_CUR_SHARED_SECRET:", process.env.NEXT_PUBLIC_CUR_SHARED_SECRET);

    await axios.post(
      '/wp-api/custom/v1/register',
      sendData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signature
        }
      }
    );
    setSubmitted(true);
  };

  if (loading) {
    return (
      <main className={styles.loadingMain}>
        <div className={styles.loadingCard}>
          <div className={styles.loader} />
          読み込み中...
        </div>
      </main>
    );
  }

  // ログイン済みならダッシュボード表示
  if (user) {
    return (
      <main>
        <header className={styles.header}>
          ようこそ、{user.name}さん！
        </header>
        <nav className={styles.dashboardNav}>
          <ul className={styles.dashboardList}>
            <li>
              <Link href="/survey-history" className={styles.dashboardLink}>
                アンケート履歴
              </Link>
            </li>
            <li>
              <Link href="/survey-detail" className={styles.dashboardLink}>
                アンケート詳細
              </Link>
            </li>
            <li>
              <Link href="/profile-edit" className={styles.dashboardLink}>
                プロフィール編集
              </Link>
            </li>
          </ul>
        </nav>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className={styles.submittedMain}>
        <div className={styles.submittedCard}>
          <div className={styles.submittedIcon}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#fff" />
              <path d="M7 13l3 3 7-7" stroke="#1976d2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className={styles.submittedTitle}>
            登録が完了しました
          </h2>
          <div className={styles.submittedText}>
            ご登録ありがとうございます。<br />
            引き続きサービスをご利用ください。
          </div>
          <button
            className={styles.returnButton}
            onClick={() => window.location.reload()}
          >
            トップへ戻る
          </button>
        </div>
      </main>
    );
  }

  // 未ログイン時は登録フォーム
  return (
    <main className={styles.main}>
      {/* line_idの表示 */}
      {user && user.line_id && (
        <div style={{ margin: '1em', color: '#1976d2', fontWeight: 'bold' }}>
          LINE ID: {user.line_id}
        </div>
      )}
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>ユーザー登録</h2>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>学年</label>
          <select name="grade" value={form.grade} onChange={handleChange} required className={styles.select}>
            <option value="">選択してください</option>
            {grades.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>クラス</label>
          <select name="class" value={form.class} onChange={handleChange} required className={styles.select}>
            <option value="">選択してください</option>
            {classes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>氏</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>名</label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>カナ（氏）</label>
          <input type="text" name="lastNameKana" value={form.lastNameKana} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>カナ（名）</label>
          <input type="text" name="firstNameKana" value={form.firstNameKana} onChange={handleChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>メールアドレス</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
            autoComplete="email"
          />
        </div>
        <button type="submit" className={styles.button}>登録</button>
        <div className={styles.loader}></div>
      </form>
    </main>
  );
}

// 不要なSurveyHistory関数の残骸を完全に削除