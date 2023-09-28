import React, { useState, useEffect } from 'react';
import { fetchAddress } from '../div/channel_div';
import { api } from '../../api/utils/api';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../Popups/ErrorPopup';
import { useUserContext } from '../context/UserContext';
import { enableTFA, verifyTFAToken } from '../../api/userApi';

const TwoFactorVerification: React.FC = () => {
	const navigate = useNavigate();
	const { user, setUser } = useUserContext();
	const [qrCode, setQrCode] = useState<string>('');
	const [secret, setSecret] = useState<string>('');
	console.log('The useState secret: ', secret);
	console.log('The stored users secret: ', user!.tfa_secret)
	console.log('The stored user is : ', user!)
	const [token, setToken] = useState<string>('');
	const [isVerified, setIsVerified] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);

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
			const userSecret = user?.tfa_secret ?? secret;
			const res = await verifyTFAToken(userSecret, token);
			setIsVerified(res);
			if (qrCode) {
				console.log("Updating user");
				const updatedUser = await enableTFA(user?.userID, secret, user?.intraUsername, user?.passwordHash);
				localStorage.setItem('user', JSON.stringify(updatedUser));
				setUser(updatedUser);
			}
			if (res) { 
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
			<button onClick={generateTOTP}>Generate new QR Code</button>
			{ qrCode && (
          		<img src={qrCode} alt="QR Code" />
			)}
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