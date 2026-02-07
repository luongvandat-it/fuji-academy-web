"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Text } from "@/components";
import styles from "./login.module.scss";
import { Logo } from "@/icon/Logo";
import { useState } from "react";
import { AUTH_TOKEN_KEY } from "@/lib";
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
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <span className={styles.logoIcon}>
            <GraduationIcon className="h-5 w-5" />
          </span>
          <Text variant="LABEL.LARGE">Fuji Academy</Text>
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            <Text variant="LABEL.MEDIUM">Home</Text>
          </Link>
          <Link href="/courses" className={styles.navLink}>
            <Text variant="LABEL.MEDIUM">Courses</Text>
          </Link>
          <Link href="/about" className={styles.navLink}>
            <Text variant="LABEL.MEDIUM">About Us</Text>
          </Link>
          <Link href="/contact" className={styles.navLink}>
            <Text variant="LABEL.MEDIUM">Contact</Text>
          </Link>
        </nav>
        <Link href="/signup" className={styles.signUpBtn}>
          <Text variant="BUTTON_LABEL.MEDIUM">Sign Up</Text>
        </Link>
      </header>

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
                label="DB NAME"
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

            {/* <div className={styles.dividerWrap}>
              <span className={styles.dividerLine}>
                <span className={styles.dividerBorder} />
              </span>
              <span className={styles.dividerText}>Or continue with</span>
            </div>

            <div className={styles.socialButtons}>
              <Button variant="secondary" className={styles.socialBtn}>
                Google
              </Button>
              <Button variant="secondary" className={styles.socialBtn}>
                Facebook
              </Button>
            </div> */}

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

function GraduationIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  );
}

function MountainBookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Book */}
      <path
        d="M8 44V20c0-2 2-4 4-4h40c2 0 4 2 4 4v24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 44h48v8H8z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <line
        x1="32"
        y1="20"
        x2="32"
        y2="44"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Mountain */}
      <path
        d="M20 44L32 28l12 16H20z"
        fill="currentColor"
      />
      <path
        d="M24 44l8-10 8 10H24z"
        fill="currentColor"
        fillOpacity="0.7"
      />
      {/* Star */}
      <path
        d="M32 18l1.2 3.6h3.8l-3 2.2 1.1 3.5L32 23.5l-3.1 2.2 1.1-3.5-3-2.2h3.8L32 18z"
        fill="currentColor"
      />
    </svg>
  );
}
