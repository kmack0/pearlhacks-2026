import Link from "next/link";
import { SavingsSummary } from "./components/SavingsSummary";

export default async function Home() {
  let total = 0;
  try {
    const res = await fetch("http://localhost:3000/api/total", { cache: "no-store" });
    const data = await res.json();
    total = data.total || 0;
  } catch (err) {
    console.error("Failed to fetch total", err);
  }

  return (
    <main className="page-container">
      <h1>Welcome to My Website</h1>
      <p>Total Savings: ${total.toFixed(2)}</p>
      
      <section className="pages-grid">
        <div className="page-card">
          <h2>Savings</h2>
          <p>Explore the first page of our website.</p>
          <Link href="/Savings" className="btn">
            Go to Savings
          </Link>
        </div>
        
        <div className="page-card">
          <h2>Lessons</h2>
          <p>Check out the second page with different content.</p>
          <Link href="/Lessons" className="btn">
            Go to Lessons
          </Link>
        </div>
      </section>
    </main>
  );
}
