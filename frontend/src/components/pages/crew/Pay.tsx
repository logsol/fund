import React from 'react';
import { useTransactionStore } from '../../../store/transactionStore';

export namespace crew {
  export const Pay: React.FC = () => {
    const { currentTransaction } = useTransactionStore();

    if (!currentTransaction) {
      return <div>No active transaction</div>;
    }

    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Transaction Overview</h2>
        {/* ... rest of the component code ... */}
      </div>
    );
  };
}

// Ensure the file is treated as a module
export {};

