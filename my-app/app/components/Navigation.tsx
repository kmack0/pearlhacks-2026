import Link from "next/link";
import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.navbar}>
      <div className={styles["nav-container"]}>
        <Link href="/" className={styles["nav-logo"]}>
          My Website
        </Link>
        <ul className={styles["nav-menu"]}>
          <li className={styles["nav-item"]}>
            <Link href="/" className={styles["nav-link"]}>
              Home
            </Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/Savings" className={styles["nav-link"]}>
              Page 1
            </Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/Lessons" className={styles["nav-link"]}>
              Page 2
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
