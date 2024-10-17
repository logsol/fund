import React from 'react';
import { useTransactionStore } from '../../store/transactionStore';

export const Pay: React.FC = () => {
  const { currentTransaction } = useTransactionStore();

  if (!currentTransaction) {
    return <div>No active transaction</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Transaction Overview</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-2">Items:</h3>
        {currentTransaction.items.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>{item.price * item.quantity} credits</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{currentTransaction.amount} credits</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center">
        <p className="text-xl font-semibold mb-2">Payment QR Code</p>
        <p>(Placeholder for QR code)</p>
      </div>
    </div>
  );
};
