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
              Master English Today
            </Text>
          <div className={styles.heroLogo}>
            <Logo />
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.card}>
            <Text variant="HEADING.TWO" className={styles.cardTitle}>
              Welcome Back
            </Text>
            <Text variant="BODY.SMALL" className={styles.cardSubtitle}>
              Log in to your account to continue your learning journey.
            </Text>

            <form
              className={styles.form}
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Center code"
                name="dbname"
                type="text"
                placeholder="Enter your DB name"
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
                    Remember Me
                  </Text>
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  <Text variant="LABEL.SMALL">Forgot Password?</Text>
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className={styles.submitBtn}
                onClick={handleLogin}
              >
                <Text variant="BUTTON_LABEL.LARGE">
                  Login
                </Text>
              </Button>
            </form>

            <Text variant="BODY.SMALL" as="p" className={styles.footerText}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className={styles.signUpLink}>
                Sign up for free
              </Link>
            </Text>
          </div>
        </section>
      </main>
    </div>
  );
}