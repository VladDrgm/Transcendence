import React, { useState, useEffect } from 'react';
import { fetchAddress } from '../div/channel_div';
import { api } from '../../api/utils/api';
import { enableTFA } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../Popups/ErrorPopup';
import { useUserContext } from '../context/UserContext';
import { postUserStatus } from '../../api/statusUpdateAPI.api';

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
		setSecret(res.secret);
		const localUser = localStorage.getItem('user');
		const localParsedUser = JSON.parse(localUser!);
		console.log(localParsedUser);
	  } catch (error) {
		setError("Something went wrong. Please try again");
		console.error('Error generating TOTP:', error);
	  }
  };

  const verifyToken = async () => {
	try {
		const localUser = localStorage.getItem('user');
		const localParsedUser = JSON.parse(localUser!);
		console.log(localParsedUser);
		const res = await api('user/verify-totp', { body: { secret, token } });
		setIsVerified(res.isValid);
		if (res.isValid) {
			try {
				const updatedUser = await enableTFA(localParsedUser.userID, secret, localParsedUser.intraUsername, localParsedUser.passwordHash);
				localParsedUser.is2FAEnabled = updatedUser.is2FAEnabled;
				localParsedUser.tfa_secret = updatedUser.tfa_secret;
				localStorage.setItem('user', JSON.stringify(localParsedUser));
				setUser(localParsedUser);
			} catch (error) {
				setError("Verifying token went wrong. Please try again!");
				console.error('Error storing the secret to the backend', error);
			}
			await postUserStatus("Online", localParsedUser);
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
        </div>
      )}
	  <ErrorPopup message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default TwoFactorSetup;