import React, { useState } from 'react';
import { fetchAddress } from '../div/channel_div';
import { api } from '../../api/utils/api';

const TwoFactorSetup: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [tempSecret, setTempSecret] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const generateTOTP = async () => {
    // const res = await generateTOTP(); //await axios.get(fetchAddress + 'auth/generate-totp'); // Ensure this endpoint points to your Nest.js server
    // setQrCode(res.data.dataURL);
    // setTempSecret(res.data.tempSecret);
	try {
		const res = await api('user/generate-totp');
		setQrCode(res.dataURL);
		setTempSecret(res.tempSecret);
	  } catch (error) {
		console.error('Error generating TOTP:', error);
	  }
  };

  const verifyToken = async () => {
    // const res = await axios.post(fetchAddress + 'auth/verify-totp', { tempSecret, token });
    // setIsVerified(res.data.isValid);
	try {
		const res = await api('user/verify-totp', { body: { tempSecret, token } });
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