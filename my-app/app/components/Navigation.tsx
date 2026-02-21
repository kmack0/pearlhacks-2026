import Link from "next/link";
import "./Navigation.css";

export default function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          My Website
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/Savings" className="nav-link">
              Page 1
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/Lessons" className="nav-link">
              Page 2
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
