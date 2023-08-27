import imageAssetBilly from './assets/billy.png'
import * as styles from './LoginPageStyles';

interface LoginPageProps
{
	/* Declare properties here */
}

const LoginPage: React.FC<LoginPageProps> = ({/* Use LoginPageProps here */}) => {

	const OnLoginWith42ButtonClick = async () => {
		// const clientID = 'u-s4t2ud-73a326211ee639e90086ae51357b3329c87424371ddde5beeb7ec62c91c29f4e';
        const clientID=`u-s4t2ud-5cd9e549c33e07468ded3a2cc3572e1a4c100c9c139d9c69edee2d7a856d2075`;
		// const redirectURI = 'http://localhost:3000/redirect';
        // const redirectURI = 'https://transcendence-server.azurewebsites.net/redirect'
        const redirectURI=process.env.REACT_APP_REDIRECT_URI|| '';

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
			<img src={imageAssetBilly} style={styles.gifStyle} ></img>
            <p style={styles.welcomeTitleStyle}>Do you want to play a game?</p>
            <button style={styles.signupButtonStyle} onClick={OnLoginWith42ButtonClick}>Sign up with 42</button>
        </div>
	);
};

export default LoginPage;
