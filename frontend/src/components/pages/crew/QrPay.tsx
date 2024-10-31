import React, { useEffect, useState } from 'react';
import { useTransactionStore } from '../../../store/transactionStore';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const QrPay: React.FC = () => {
  const { currentTransaction, getPaymentUrl } = useTransactionStore();
  const [status, setStatus] = useState<'pending' | 'paid' | 'cancelled' | 'error'>('pending');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentTransaction?._id) return;

    const checkTransactionStatus = async () => {
      try {
        const response = await axios.get(`/api/transactions/${currentTransaction._id}`);
        const transaction = response.data;

        if (transaction.status === 'paid') {
          setStatus('paid');
          return true;
        }
        
        if (transaction.status === 'cancelled') {
          setStatus('cancelled');
          setStatusMessage(transaction.cancelReason || 'Transaction was cancelled');
          return true;
        }
      } catch (error) {
        setStatus('error');
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setStatusMessage(error.response.data.message);
        } else {
          setStatusMessage('Failed to check transaction status');
        }
        return true;
      }
      return false;
    };

    // Set up polling interval
    const intervalId = setInterval(async () => {
      const shouldStop = await checkTransactionStatus();
      if (shouldStop) {
        clearInterval(intervalId);
      }
    }, 500); // Poll every 500ms (twice per second)

    // Cleanup interval on unmount or when transaction changes
    return () => clearInterval(intervalId);
  }, [currentTransaction?._id]);

  useEffect(() => {
    if (status === 'paid' || status === 'error') {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

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

      {status === 'pending' && (
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
      )}

      {status === 'paid' && (
        <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
          <p className="text-xl font-semibold text-green-700">
            Payment Successful! ✅
          </p>
          <p className="text-sm text-green-600 mt-2">
            Redirecting to dashboard...
          </p>
        </div>
      )}

      {status === 'cancelled' && (
        <div className="bg-yellow-100 p-6 rounded-lg shadow-md text-center">
          <p className="text-xl font-semibold text-yellow-700">
            Transaction Cancelled ⚠️
          </p>
          {statusMessage && (
            <p className="text-sm text-yellow-600 mt-2">
              Reason: {statusMessage}
            </p>
          )}
          <p className="text-sm text-yellow-600 mt-2">
            Redirecting to dashboard...
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-100 p-6 rounded-lg shadow-md text-center">
          <p className="text-xl font-semibold text-red-700">
            Payment Failed ❌
          </p>
          {statusMessage && (
            <p className="text-sm text-red-600 mt-2">
              {statusMessage}
            </p>
          )}
          <p className="text-sm text-red-600 mt-2">
            Redirecting to dashboard...
          </p>
        </div>
      )}
    </div>
  );
};
