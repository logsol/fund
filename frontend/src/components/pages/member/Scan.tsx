import React, { useState, useEffect } from 'react';
import { Scanner, IDetectedBarcode, useDevices } from '@yudiel/react-qr-scanner';
import { useNavigate, useLocation } from 'react-router-dom';

export const Scan: React.FC = () => {
  const devices = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(devices[0]?.deviceId || null);
  let previousUrlString = "";

  const navigate = useNavigate();
  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].deviceId);
    }
  }, [devices, selectedDeviceId]);

  const extractTransactionIdFromUrl = (url: string): string | null => {

    const parsedUrl = new URL(url);

    // Create regex pattern to match any base URL followed by 
    // /pay/ and a 24-character hexadecimal string
    const pathNamePattern = new RegExp(`^/pay/([a-f\\d]{24})\/?$`);

    // Extract transaction ID from URL
    const match = parsedUrl.pathname.match(pathNamePattern);

    // Return transaction ID or null
    const transactionId = match ? match[1] : null;

    return transactionId;
  }

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {

      // iterate over detectedCodes
      for (const code of detectedCodes) {
        const paymentUrl = code.rawValue;

        // skip empty strings
        if (paymentUrl === "") {
          continue;
        }

        // Skip double scans
        if (paymentUrl === previousUrlString) {
          continue;
        }

        // Store the current URL string
        previousUrlString = paymentUrl;

        // Extract the transaction ID from the URL
        const transactionId = extractTransactionIdFromUrl(paymentUrl);  

        // Navigate to the payment page
        if (transactionId) {
          navigate(`/pay/${transactionId}`);
        } else {
          setTimeout(() => {
            alert('Invalid transaction');
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 sm:px-8 justify-center pb-[15vh] px-8">

      {(
        <div className="w-full aspect-square max-w-md">
          <Scanner
            onScan={handleScan}
            allowMultiple={true}
            constraints={{ 
              deviceId: selectedDeviceId || undefined,
              facingMode: 'environment',
            }}
          />
        </div>
      )}

      <div className="mt-4 w-full max-w-md">
        <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700 mb-2">
          Change Camera
        </label>
        <select
          id="camera-select"
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedDeviceId || ''}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
