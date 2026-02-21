

type Fund = {
  id: string;              // unique identifier
  name: string;            // fund name
  goalAmount: number;      // target contribution amount
  currentAmount: number;   // amount saved so far
  createdDate: string;     // when fund was created
}

export default function Funds() {
  return (
    <main className="page-container">
      <h1>Funds</h1>
      <p>This is the second page of the website.</p>
      <section>
        <h2>Another Content Section</h2>
        <p>Each page can have its own unique content and styling. Feel free to customize this page as needed.</p>
      </section>
    </main>
  );
}
