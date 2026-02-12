import styles from "../placeholder.module.scss";

export default function MessagesPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Tin nhắn</h1>
      <div className={styles.card}>
        <p className={styles.cardText}>Sắp ra mắt...</p>
      </div>
    </div>
  );
}
