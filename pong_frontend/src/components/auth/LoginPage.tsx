import React from "react";
import imageAssetBilly from '../assets/billy.png'
import * as styles from './LoginPageStyles';

const LoginPage: React.FC = () => {

	const OnLoginWith42ButtonClick = async () => {
        const clientID=`${process.env.REACT_APP_AUTH_UID}` || '';
        const redirectURI=`${process.env.REACT_APP_BASE_URL}redirect` || '';

		// Construct the URL for the 42 API authorization endpoint
		const authEndpoint = 'https://api.intra.42.fr/oauth/authorize';
		const queryParams = new URLSearchParams({
		  client_id: clientID,
		  redirect_uri: redirectURI,
		  response_type: 'code',
		  scope: 'public',
		});
		const authorizationUrl = `${authEndpoint}?${queryParams.toString()}`;

		// Open the 42 API authorization page in a new tab
		window.open(authorizationUrl, '_blank');
	}

	return (
		<div style={styles.pageStyle}>
			<img src={imageAssetBilly} style={styles.gifStyle} alt="" ></img>
            <p style={styles.welcomeTitleStyle}>Do you want to play a game?</p>
            <button style={styles.signupButtonStyle} onClick={OnLoginWith42ButtonClick}>Sign up with 42</button>
        </div>
	);
};

export default LoginPage;
