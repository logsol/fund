import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useTransactionStore } from '../../../store/transactionStore';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export const PayLink: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { payTransaction } = useTransactionStore();
  useEffect(() => {
    const processPayment = async () => {
      if (!transactionId) {
        setPaymentStatus('error');
        setErrorMessage('Transaction ID is missing');
        return;
      }

      if (!user?._id) {
        setPaymentStatus('error');
        setErrorMessage('User is not authenticated');
        return;
      }

      try {
        const result = await payTransaction(transactionId, user._id);
        if (result.success) {
          setPaymentStatus('success');
        } else {
          setPaymentStatus('error');
          setErrorMessage(result.message || 'Payment could not be processed');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        setPaymentStatus('error');
        setErrorMessage('An unexpected error occurred');
      }
    };

    processPayment();
  }, [transactionId]);

  useEffect(() => {
    if (paymentStatus === 'success' || paymentStatus === 'error') {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

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
        {paymentStatus === 'success' && (
          <>
            Payment successful!
            <span className="block mt-2 text-sm text-gray-600">
              Redirecting to dashboard...
            </span>
          </>
        )}
        {paymentStatus === 'error' && (
          <>
            Payment failed
            {errorMessage && (
              <span className="block mt-2 text-sm text-red-600">
                {errorMessage}
              </span>
            )}
            <span className="block mt-2 text-sm text-gray-600">
              Redirecting to dashboard...
            </span>
          </>
        )}
      </p>
    </div>
  );
};
