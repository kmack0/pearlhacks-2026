import Link from "next/link";

export default function Home() {
  return (
    <main className="page-container">
      <h1>Welcome to My Website</h1>
      <p>This is the home page of your new website.</p>
      
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
