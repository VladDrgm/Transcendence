import React, { useState, useEffect } from 'react';
import { fetchAddress } from '../div/channel_div';
import { api } from '../../api/utils/api';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../Popups/ErrorPopup';
import { useUserContext } from '../context/UserContext';

const TwoFactorVerification: React.FC = () => {
	const navigate = useNavigate();
	const [qrCode, setQrCode] = useState<string>('');
	const [secret, setSecret] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [isVerified, setIsVerified] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);

  useEffect(() => {
	console.log("The secret from useEffect is", secret);
	setSecret(secret);
  }, [secret]);

  const verifyToken = async () => {
	try {
		const res = await api('user/verify-totp', { body: { secret, token } });
		setIsVerified(res.isValid);
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
        <div>
          	<input
				type="text"
				value={token}
				onChange={(e) => setToken(e.target.value)}
				placeholder="Enter the token"
          	/>
          	<button onClick={verifyToken}>Verify Token</button>
          	{ isVerified !== null && (
            	<div>
              		{ isVerified ? 'Token is valid!' : 'Token is invalid!' }
            	</div>
          	)}
        </div>
	  <ErrorPopup message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default TwoFactorVerification;