import React, { useState, useEffect } from 'react';
import { api } from '../../api/utils/api';
import { enableTFA } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../Popups/ErrorPopup';
import { useUserContext } from '../context/UserContext';
import { postUserStatus } from '../../api/statusUpdateAPI.api';
import * as styles from './TFASetupStyles';

const TwoFactorSetup: React.FC = () => {
	const navigate = useNavigate();
	const [qrCode, setQrCode] = useState<string>('');
	const [secret, setSecret] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [, setIsVerified] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { setUser } = useUserContext();

	useEffect(() => {
		// Check if the user is logged in when the component mounts
		const localUser = localStorage.getItem('user');
		const localParsedUser = JSON.parse(localUser!);
		if (!localParsedUser) {
			navigate('/login'); // Redirect to the login page if not logged in
		}
		setSecret(secret);
  	}, [secret, navigate]);

  const generateTOTP = async () => {
	try {
		const res = await api('user/generate-totp');
		setQrCode(res.dataURL);
		setSecret(res.secret);
	  } catch (error) {
		setError("Error generating QR code. Please try again!");
		console.error('Error generating TOTP:', error);
	  }
  };

  const verifyToken = async () => {
	try {
		const localUser = localStorage.getItem('user');
		const localParsedUser = JSON.parse(localUser!);
		const res = await api('user/verify-totp', { body: { secret, token } });
		setIsVerified(res.isValid);
		if (res.isValid) {
			try {
				const updatedUser = await enableTFA(localParsedUser.userID, secret, localParsedUser.intraUsername, localParsedUser.passwordHash, true);
				localParsedUser.is2FAEnabled = updatedUser.is2FAEnabled;
				localParsedUser.tfa_secret = updatedUser.tfa_secret;
				localStorage.setItem('user', JSON.stringify(localParsedUser));
				setUser(localParsedUser);
			} catch (error) {
				setError("Verifying token went wrong. Please try again!");
				console.error('Error storing the secret to the backend', error);
			}
			if (await postUserStatus("Online", localParsedUser) === true) {
				localParsedUser.status = "Online";
				localStorage.setItem('user', JSON.stringify(localParsedUser));
				setUser(localParsedUser);
			}
			navigate(`/`);
		} else { 
			setError("Error: Invalid token");
			console.error("Error: Invalid token");
		}
	  } catch (error) {
		setError("Something went wrong. Please try again");
		console.error('Error verifying token:', error);
	  }
  };

  return (
    <div style={styles.pageStyle}>
      <button style={styles.buttonStyle} onClick={generateTOTP}>Generate QR Code</button>
      {qrCode && (
        <div>
          <img src={qrCode} alt="QR Code" />
		  <div>
			<input
				type="text"
				value={token}
				onChange={(e) => setToken(e.target.value)}
				placeholder="Enter the token"
			/>
		 	</div>
          <button style={styles.buttonStyle} onClick={verifyToken}>Verify Code</button>
        </div>
      )}
	  <ErrorPopup message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default TwoFactorSetup;