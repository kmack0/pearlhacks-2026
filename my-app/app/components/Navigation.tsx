import Link from "next/link";
import styles from "./Navigation.module.css";

// Renders nav bar with links to Home, Savings, and Funds pages
export default function Navigation() {
  return (
    <nav className={styles.navbar}>
      <div className={styles["nav-container"]}>
        <Link href="/" className={styles["nav-logo"]}>
        <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "100px" }}
          />
        </Link>
        <ul className={styles["nav-menu"]}>
          <li className={styles["nav-item"]}>
            <Link href="/" className={styles["nav-link"]}>
              Home
            </Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/Savings" className={styles["nav-link"]}>
              Savings
            </Link>
          </li>
          <li className={styles["nav-item"]}>
            <Link href="/Funds" className={styles["nav-link"]}>
              Funds
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
