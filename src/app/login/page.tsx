"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Text } from "@/components";
import styles from "./login.module.scss";
import { Logo } from "@/icon/Logo";
import { useState } from "react";
import { login } from "@/service/modules/login/logic";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dbname, setDbname] = useState('fuji_stg');
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const response = await login(username, password, dbname);
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.data));
        router.replace("/");
      } else {
        setError(response.message ?? "Đăng nhập thất bại.");
      }
    } catch (err) {
      console.error(err);
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBlur1} />
          <div className={styles.heroBlur2} />
          <Text variant="HEADING.ONE" className={styles.heroTitle}>
              Làm chủ tiếng Anh hôm nay
            </Text>
          <div className={styles.heroLogo}>
            <Logo />
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.card}>
            <Text variant="HEADING.TWO" className={styles.cardTitle}>
              Chào mừng trở lại
            </Text>
            <Text variant="BODY.SMALL" className={styles.cardSubtitle}>
              Đăng nhập vào tài khoản để tiếp tục hành trình học tập.
            </Text>

            <form
              className={styles.form}
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                label="Địa chỉ email"
                name="email"
                type="email"
                placeholder="vidu@email.com"
                autoComplete="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Mã trung tâm"
                name="dbname"
                type="text"
                placeholder="Tên cơ sở dữ liệu"
                autoComplete="database-name"
                value={dbname}
                readOnly
              />
              {error && (
                <p className={styles.errorText} role="alert">
                  {error}
                </p>
              )}
              <div className={styles.formRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="remember"
                    className={styles.checkbox}
                  />
                  <Text variant="LABEL.SMALL" as="span">
                    Ghi nhớ đăng nhập
                  </Text>
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  <Text variant="LABEL.SMALL">Quên mật khẩu?</Text>
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className={styles.submitBtn}
                onClick={handleLogin}
              >
                <Text variant="BUTTON_LABEL.LARGE">
                  Đăng nhập
                </Text>
              </Button>
            </form>

            <Text variant="BODY.SMALL" as="p" className={styles.footerText}>
              Chưa có tài khoản?{" "}
              <Link href="/signup" className={styles.signUpLink}>
                Đăng ký miễn phí
              </Link>
            </Text>
          </div>
        </section>
      </main>
    </div>
  );
}