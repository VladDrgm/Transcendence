import React, { useState } from 'react';
import axios from 'axios';

const TwoFactorSetup: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [tempSecret, setTempSecret] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const generateTOTP = async () => {
    const res = await axios.get('/auth/generate-totp'); // Ensure this endpoint points to your Nest.js server
    setQrCode(res.data.dataURL);
    setTempSecret(res.data.tempSecret);
  };

  const verifyToken = async () => {
    const res = await axios.post('/auth/verify-totp', { tempSecret, token });
    setIsVerified(res.data.isValid);
  };

  return (
    <div>
      <button onClick={generateTOTP}>Generate TOTP</button>
      {qrCode && (
        <div>
          <img src={qrCode} alt="QR Code" />
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter the token"
          />
          <button onClick={verifyToken}>Verify Token</button>
          {isVerified !== null && (
            <div>
              {isVerified ? 'Token is valid!' : 'Token is invalid!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;