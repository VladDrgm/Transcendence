import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../Popups/ErrorPopup';
import { useUserContext } from '../context/UserContext';
import { verifyTFAToken } from '../../api/userApi';
import { postUserStatus } from '../../api/statusUpdateAPI.api';
import * as styles from './TFASetupStyles';

const TwoFactorVerification: React.FC = () => {
	const navigate = useNavigate();
	const { setUser } = useUserContext();
	const [token, setToken] = useState<string>('');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Check if the user is logged in when the component mounts
		const localUser = localStorage.getItem('user');
		const localParsedUser = JSON.parse(localUser!);
		if (!localParsedUser) {
		  navigate('/login'); // Redirect to the login page if not logged in
		}
	}, [navigate]);

	const verifyToken = async () => {
		try {
			const localUser = localStorage.getItem('user');
			const localParsedUser = JSON.parse(localUser!);
			const userSecret = localParsedUser.TFASecret;
			const res = await verifyTFAToken(userSecret, token);
			if (res) { 
				if (await postUserStatus("Online", localParsedUser) === true) {
					localParsedUser.status = "Online";
					localStorage.setItem('user', JSON.stringify(localParsedUser));
				}
				setUser(localParsedUser);
				navigate(`/`);
			} else { 
				setError("Error: Invalid token");
				console.error("Token is invalid");
			}
		} catch (error) {
			setError("Something went wrong. Please try again");
			console.error('Error verifying token:', error);
		}
  	};

  return (
    <div style={styles.pageStyle}>
        <div>
          	<input
				type="text"
				value={token}
				onChange={(e) => setToken(e.target.value)}
				placeholder="Enter the token"
          	/>
			<div>
          		<button style={styles.buttonStyle} onClick={verifyToken}>Verify Token</button>
			</div>
        </div>
	  	<ErrorPopup message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default TwoFactorVerification;