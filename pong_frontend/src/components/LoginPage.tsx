import React, { useState } from 'react';
import { login, userLoginAPI, userSignupAPI } from '../api/authAPI';
import { useNavigate } from 'react-router-dom';
import gif from './assets/billy.png'
import { User } from '../interfaces/user.interface';
import { UserContextProvider, useUserContext } from './context/UserContext';
import * as styles from './LoginPageStyles';

interface LoginPageProps
{
	onSignUp: (user: User) => void;
  	// userID_set: React.Dispatch<React.SetStateAction<number>>;
  	// loginDone_set: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({onSignUp}) => {

	const { user, setUser } = useUserContext();

	const [showLoginPopup, setShowLoginPopup] = useState(false);
	const [showSignupPopup, setShowSignupPopup] = useState(false);

	const [username, setUsername] = useState(''); // Login state for username input
	const [password, setPassword] = useState(''); // Login state for password input
	
	const [newUsername, setNewUsername] = useState(''); // Sign up state for username input
	const [newIntraUsername, setNewIntraUsername] = useState(''); // Sign up state for username input
	const [newPassword, setNewPassword] = useState(''); // Sign up state for password input

	const [error, setError] = useState<string | null>(null);
  
	const OnSignUpButtonClick = async () => {
		setShowSignupPopup(true);
	};

	const OnLoginButtonClick = async () => {
		setShowLoginPopup(true);
	};

	const OnLoginWith42ButtonClick = async () => {
		const clientID = 'u-s4t2ud-73a326211ee639e90086ae51357b3329c87424371ddde5beeb7ec62c91c29f4e';
		const redirectURI = 'http://localhost:3000/redirect';

		// Construct the URL for the 42 API authorization endpoint
		const authEndpoint = 'https://api.intra.42.fr/oauth/authorize';
		const queryParams = new URLSearchParams({
		  client_id: clientID,
		  redirect_uri: redirectURI,
		  response_type: 'code',
		  scope: 'public',
		});
		const authorizationUrl = `${authEndpoint}?${queryParams.toString()}`;
	  
		// Redirect the user to the 42 API authorization endpoint inside the same window
		// window.location.href = authorizationUrl;

		// Open the 42 API authorization page in a new tab
		window.open(authorizationUrl, '_blank');
	}

	const handleSignUp = async () => {
		const newUser: User = {
			username: newUsername,
			intraUsername: newUsername,
			userID: 123,
			avatarPath: '',
			wins: 0,
			losses: 0,
			points: 0,
			status: '',
			achievementsCSV: '',
			passwordHash: newPassword,
			friends: [],
			befriendedBy: [],
			blocked: [],
			blockedBy: [],
			adminChannels: [],
			blockedChannels: [],
			channels: [],
			socketId: '',
		  };

		try {
			const newCreatedUser: User = await userSignupAPI(newUser);
			onSignUp(newCreatedUser);
			await login(newCreatedUser.userID);
			// userID_set(newCreatedUser.userID);
			// loginDone_set(true);
		} catch (error) {
			setError('Error creating a new user');
		}
		setShowSignupPopup(false)
	};

  const handleLogin = async () => {
	const user = {
		username: username,
		password: password
	}
	try {
		const loggedInUser = await userLoginAPI(user.username, user.password);
		onSignUp(loggedInUser);
		// await login(loggedInUser.userID);
		// userID_set(loggedInUser.userID);
		// loginDone_set(true);
		const userJSON = JSON.stringify(loggedInUser);
		localStorage.setItem('user', userJSON);
		setUser(loggedInUser);
	} catch (error) {
		setError('Error logging in. Try again!');
	}
	setShowLoginPopup(false)
  };
//   async function signUpUser() {
// 	createNewUser();
// 	input_user_id = 1
// 	if (input_user_id != 0)
//     {
//       if (!isNaN(input_user_id))
//       {
//         await login(input_user_id);
//         userID_set(input_user_id);
//         loginDone_set(true);
//       }
//       input_user_id = 0
//     }
//   };
	return (
		<div style={styles.pageStyle}>
			<img src={gif} style={styles.gifStyle} ></img>
            <p style={styles.welcomeTitleStyle}>Do you want to play a game?</p>
            <button style={styles.loginButtonStyle} onClick={OnLoginButtonClick}>Login</button>
            <button style={styles.signupButtonStyle} onClick={OnSignUpButtonClick}>Sign up</button>
            <button style={styles.signupButtonStyle} onClick={OnLoginWith42ButtonClick}>Sign up with 42</button>

			{showLoginPopup && (
        		<div style={styles.loginPopupStyle}>
          		<p style={styles.popUpTitleStyle}>Login</p>
          		<form>
					<input
					type="text"
					placeholder="Username"
					value={username}
              		onChange={(e) => setUsername(e.target.value)} // Update state on change
					style={styles.formFieldStyle}
					/>
				</form>
				<form>
					<input
					type="password"
					placeholder="Password"
					value={password}
              		onChange={(e) => setPassword(e.target.value)} // Update state on change
					style={styles.formFieldStyle}
					/>
				</form>
          		<button style={styles.popUpLoginButtonStyle} onClick={handleLogin}>Login</button>
        		</div>
      		)}

			{showSignupPopup && (
        		<div style={styles.signupPopupStyle}>
          			<p style={styles.popUpTitleStyle}>Sign Up</p>
          			<form>
						<input
						type="text"
						placeholder="Username"
						value={newUsername}
              			onChange={(e) => setNewUsername(e.target.value)} // Update state on change
						style={styles.formFieldStyle}
						/>
						<input
						type="password"
						placeholder="Password"
						value={newPassword}
              			onChange={(e) => setNewPassword(e.target.value)} // Update state on change
						style={styles.formFieldStyle}
						/>
					</form>
          			<button style={styles.popUpSignupButtonStyle} onClick={handleSignUp}>Sign up</button>
        		</div>
      		)}

        </div>
	);
};

export default LoginPage;
