import React from 'react';
import { useTransactionStore } from '../../../store/transactionStore';
import QRCode from 'react-qr-code';

export const QrPay: React.FC = () => {
  const { currentTransaction, getPaymentUrl } = useTransactionStore();

  if (!currentTransaction) {
    return <div>No active transaction</div>;
  }

  // Get the payment URL for the current transaction
  const paymentUrl = getPaymentUrl(currentTransaction._id);

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
        <p className="text-xl font-semibold mb-4">Scan to Pay</p>
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={paymentUrl}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>
    </div>
  );
};
