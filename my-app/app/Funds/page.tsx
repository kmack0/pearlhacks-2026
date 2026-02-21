

'use client';

import { useState } from 'react';
import FundCard from '@/app/components/FundCard';

type Fund = {
  id: string;              // unique identifier
  name: string;            // fund name
  goalAmount: number;      // target contribution amount
  currentAmount: number;   // amount saved so far
  createdDate: string;     // when fund was created
}

export default function Funds() {
  const [funds, setFunds] = useState<Fund[]>([]);

  return (
    <main className="page-container">
      <h1>Funds</h1>
      {funds.map((fund: Fund) => (
        <FundCard key={fund.id} fund={fund} />
      ))}
    </main>
  );
}
