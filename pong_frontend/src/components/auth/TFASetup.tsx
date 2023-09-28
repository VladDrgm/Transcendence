import React, { useState, useEffect } from 'react';
import { fetchAddress } from '../div/channel_div';
import { api } from '../../api/utils/api';
import { enableTFA } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../Popups/ErrorPopup';
import { useUserContext } from '../context/UserContext';

const TwoFactorSetup: React.FC = () => {
	const navigate = useNavigate();
	const [qrCode, setQrCode] = useState<string>('');
	const [secret, setSecret] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [isVerified, setIsVerified] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { user, setUser } = useUserContext();

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
		setError("Something went wrong. Please try again");
		console.error('Error generating TOTP:', error);
	  }
  };

  const verifyToken = async () => {
	try {
		const res = await api('user/verify-totp', { body: { secret, token } });
		setIsVerified(res.isValid);
		try {
			const updatedUser = await enableTFA(user?.userID, secret, user?.intraUsername, user?.passwordHash);
			localStorage.setItem('user', JSON.stringify(updatedUser));
			// setUser(updatedUser);
		} catch (error) {
			setError("Verifying token went wrong. Please try again!");
			console.error('Error storing the secret to the backend', error);
		}
		if (res.isValid) {
			navigate(`/`);
		} else { 
			setError("Error: Invalid token");
		}
	  } catch (error) {
		setError("Something went wrong. Please try again");
		console.error('Error verifying token:', error);
	  }
  };

  return (
    <div>
      <button onClick={generateTOTP}>Generate QR Code</button>
      {qrCode && (
        <div>
          <img src={qrCode} alt="QR Code" />
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter the token"
          />
          <button onClick={verifyToken}>Verify Code</button>
          {isVerified !== null && (
            <div>
              {isVerified ? 'Token is valid!' : 'Token is invalid!'}
            </div>
          )}
        </div>
      )}
	  <ErrorPopup message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default TwoFactorSetup;