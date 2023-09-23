import React, { useState, useEffect } from 'react';
import { fetchAddress } from '../div/channel_div';
import { api } from '../../api/utils/api';

const TwoFactorSetup: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
	console.log("The secret from useEffect is", secret);
	setSecret(secret);
  }, [secret]);

  const generateTOTP = async () => {
	try {
		const res = await api('user/generate-totp');
		setQrCode(res.dataURL);
		await setSecret(res.secret);
	  } catch (error) {
		console.error('Error generating TOTP:', error);
	  }
  };

  const verifyToken = async () => {
	try {
		const res = await api('user/verify-totp', { body: { secret, token } });
		setIsVerified(res.isValid);
	  } catch (error) {
		console.error('Error verifying token:', error);
	  }
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