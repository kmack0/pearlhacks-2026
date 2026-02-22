import Link from "next/link";
import GardenList from "./components/GardenList";

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/funds`);
  const funds = await response.json();
  const totalGoalAmount = funds.reduce((sum: number, fund: any) => sum + fund.goalAmount, 0);

  let total = 0;
  try {
    const res = await fetch(`${baseUrl}/api/total`, { cache: "no-store" });
    const data = await res.json();
    total = data.total || 0;
  } catch (err) {
    console.error("Failed to fetch total", err);
  }

  const percentage = Math.min((total / totalGoalAmount) * 100, 100);
  return (
    <main className="page-container">

    <div className="my-8 p-6 bg-white rounded-xl shadow-sm border">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-sm text-[#303234] uppercase tracking-wider">Current Savings</p>
          <h2 className="text-4xl font-bold text-[#004700]">${total.toFixed(2)} / ${totalGoalAmount.toFixed(2)}</h2>
        </div>
        <p className="text-xl font-medium text-gray-600">{percentage.toFixed(0)}% to Goal</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out bg-[#004700]"
          style={{ width: `${percentage}%`,
            backgroundColor: "#004700",
            minWidth: percentage > 0 ? "2px" : "0"
           }}
        />
      </div>
    </div>

    <div className="my-8">
        <h2 className="text-2xl font-bold text-[#004700] mb-4">Your Funds Garden</h2> 
        <GardenList />
      </div>


      <section className="pages-grid">
        <div className="page-card">
          <h2>Savings</h2>
          <p>Take a look at your current savings!</p>
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