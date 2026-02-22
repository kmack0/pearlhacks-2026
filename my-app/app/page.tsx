import Link from "next/link";

export default async function Home() {
  let total = 0;
  try {
    const res = await fetch("http://localhost:3000/api/total", { cache: "no-store" });
    const data = await res.json();
    total = data.total || 0;
  } catch (err) {
    console.error("Failed to fetch total", err);
  }
  const savingsGoal = 10000; // Example goal amount
  const percentage = Math.min((total / savingsGoal) * 100, 100);
  return (
    <main className="page-container">
      <h1>Welcome to My Website</h1>
      <p>Total Savings: ${total.toFixed(2)}</p>

    <div className="my-8 p-6 bg-white rounded-xl shadow-sm border">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider">Current Savings</p>
          <h2 className="text-4xl font-bold text-green-600">${total.toFixed(2)}</h2>
        </div>
        <p className="text-sm font-medium text-gray-400">{percentage.toFixed(0)}% to Goal</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div 
          className="bg-green-500 h-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
      
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
