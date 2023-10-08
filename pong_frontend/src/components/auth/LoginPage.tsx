import React from "react";
import * as styles from './LoginPageStyles';
import imageAssetBilly from '../assets/billy.png'

const LoginPage: React.FC = () => {

	const OnLoginWith42ButtonClick = async () => {
        const clientID=`${process.env.REACT_APP_AUTH_UID}` || '';
        const redirectURI=`${process.env.REACT_APP_BASE_URL}redirect` || '';

		const authEndpoint = 'https://api.intra.42.fr/oauth/authorize';
		const queryParams = new URLSearchParams({
		  client_id: clientID,
		  redirect_uri: redirectURI,
		  response_type: 'code',
		  scope: 'public',
		});
		const authorizationUrl = `${authEndpoint}?${queryParams.toString()}`;

		window.location.replace(authorizationUrl);
	}

	return (
		<div style={styles.pageStyle}>
			<img alt="" src={imageAssetBilly} style={styles.gifStyle} ></img>
            <p style={styles.welcomeTitleStyle}>Do you want to play a game?</p>
            <button onClick={OnLoginWith42ButtonClick} style={styles.signupButtonStyle}>Sign up with 42</button>
        </div>
	);
};

export default LoginPage;
