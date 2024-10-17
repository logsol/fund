import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useTransactionStore } from '../../../store/transactionStore';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export const PayLink: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { payTransaction } = useTransactionStore();
  useEffect(() => {
    const processPayment = async () => {
      if (!transactionId) {
        setPaymentStatus('error');
        return;
      }

      if (!user?._id) {
        setPaymentStatus('error');
        return;
      }

      try {
        const success = await payTransaction(transactionId, user._id);
        if (success) {
          setPaymentStatus('success');
        } else {
          setPaymentStatus('error');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        setPaymentStatus('error');
      }
    };

    processPayment();
  }, [transactionId]);

  useEffect(() => {
    if (paymentStatus !== 'processing') {
      const timer = setTimeout(() => {
        // set fail state
        setPaymentStatus('error');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {paymentStatus === 'processing' && (
        <ArrowPathIcon className="w-16 h-16 text-blue-500 animate-spin" />
      )}
      {paymentStatus === 'success' && (
        <CheckCircleIcon className="w-16 h-16 text-green-500" />
      )}
      {paymentStatus === 'error' && (
        <XCircleIcon className="w-16 h-16 text-red-500" />
      )}
      <p className="mt-4 text-xl font-semibold">
        {paymentStatus === 'processing' && 'Processing payment...'}
        {paymentStatus === 'success' && 'Payment successful!'}
        {paymentStatus === 'error' && 'Payment failed. Please try again.'}
      </p>
    </div>
  );
};
