import React, { useState, useEffect } from 'react';
import { Scanner, IDetectedBarcode, useDevices } from '@yudiel/react-qr-scanner';

export const Scan: React.FC = () => {
  const devices = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(devices[0]?.deviceId || null);

  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].deviceId);
    }
  }, [devices, selectedDeviceId]);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      console.log(detectedCodes[0].rawValue);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-gray-100 sm:px-8 justify-center pb-[15vh] px-8">

      {(
        <div className="w-full aspect-square max-w-md">
          <Scanner
            onScan={handleScan}
            constraints={{ 
              deviceId: selectedDeviceId || undefined,
              facingMode: 'environment' 
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
