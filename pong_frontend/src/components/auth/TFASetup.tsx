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
	setSecret(secret); // This will log the updated value
  }, [secret]);

  const generateTOTP = async () => {
	try {
		const res = await api('user/generate-totp');
		console.log("Received from server:", res); 
		setQrCode(res.dataURL);
		console.log("The pre set current secret is", { secret });
		console.log("The server secret is", res.tempSecret );
		await setSecret(res.tempSecret);
		console.log("The new secret is", { secret });
	  } catch (error) {
		console.error('Error generating TOTP:', error);
	  }
  };

  const verifyToken = async () => {
	try {
		console.log("The secret is", { secret });
		const res = await api('user/verify-totp', { body: { secret, token } });
		console.log("Sending to server:", { secret, token });
		console.log("The secret is", res);
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