import { Properties } from 'csstype';

export const pageStyle: Properties = {
	backgroundColor: 'rgba(3, 3, 3, 1)',
	height: '100%',
	width: '100%',
	position: 'absolute',
	alignItems: 'center',
	flexDirection: 'column',
	textAlign: 'center',
	justifyContent: 'center',
	left: 0,
	right: 0,
	margin: 0,
	display: 'flex',
}

export const gifStyle: Properties = {
	position: 'relative',
	top: '40px',
	padding: '24px',
	width:'360px',
	height:'360px', 
  };

export const welcomeTitleStyle: Properties = {
  color: 'rgba(254, 8, 16, 1)',
  position: 'relative',
  textAlign: 'center',
  top: '8px',
  padding: '4px',
  fontFamily: 'Shlop',
  fontSize: '80px',
};

export const loginButtonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	display: 'block',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginBottom: '20px',
}

export const signupButtonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	display: 'block',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginBottom: '20px',
}

export const loginPopupStyle: Properties = {
    position: 'fixed',
    top: '60%',
    left: '50%',
	height: '40%',
	width: '40%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: 'rgba(3, 3, 3, 1)',
    boxShadow: '0 2px 20px rgba(255, 255, 255, 1)',
	borderRadius: '4px',
    border: '1px solid #fff',
    zIndex: 9999,
}

export const signupPopupStyle: Properties = {
    position: 'fixed',
    top: '60%',
    left: '50%',
	height: '40%',
	width: '40%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: 'rgba(3, 3, 3, 1)',
    boxShadow: '0 2px 20px rgba(255, 255, 255, 1)',
	borderRadius: '4px',
    border: '1px solid #fff',
    zIndex: 9999,
}

export const popUpTitleStyle: Properties = {
	color: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	textAlign: 'center',
	fontFamily: 'Shlop',
	fontSize: '50px',
  };

export const popUpLoginButtonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginTop: '20px',
}

export const popUpSignupButtonStyle: Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginTop: '10px',
}

export const formFieldStyle: Properties = {
    padding: '8px',
    width: '200px',
    fontSize: '18px',
    borderRadius: '4px',
    border: '1px solid #fff',
	marginBottom: '13px',
	fontFamily: 'Shlop',
<<<<<<< HEAD:pong_frontend/src/components/LoginPageStyles.ts
}
=======
}
  
	const OnSignUpButtonClick = async () => {
		setShowSignupPopup(true);
	};

	const OnLoginButtonClick = async () => {
		setShowLoginPopup(true);
	};

	const handleSignUp = async () => {
		const newUser: User = {
			username: newUsername,
			intraUsername: newUsername,
			userID: 123,
			socketId: '',
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
		  };

		try {
			// Make API call and get the response
			const response = await fetch(fetchAddress + signUpEndpoint, {
				method:"POST",
				headers: {
					"Content-Type": "application/json"
				},
				body:JSON.stringify(newUser),
			});
		
			if (response.ok) {
				const newUser: User = await response.json();
				onSignUp(newUser);
				await login(newUser.userID);
				userID_set(newUser.userID);
				loginDone_set(true);
			} else {
				throw new Error(response.statusText);
			}
		} catch (error) {
			throw new Error('Error creating a new user');
		}
		setShowSignupPopup(false)
	};

  const handleLogin = async () => {
	const user = {
		username: username,
		password: password
	}
	try {
		// Make API call and get the response
		const response = await fetch(fetchAddress + loginEndpoint1 + username + endpointSlash + password + loginEndpoint2, {
			method:"POST",
			headers: {
				"Content-Type": "application/json"
			},
		});
	
		if (response.ok) {
			const loggedInUser: User = await response.json(); 
			onSignUp(loggedInUser);
			await login(loggedInUser.userID);
			userID_set(loggedInUser.userID);
			loginDone_set(true);
		} else {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error('Error logging in. Try again!');
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
  return (<div style={pageStyle}>
			<img src={gif} style={gifStyle} ></img>
            <p style={welcomeTitleStyle}>Do you want to play a game?</p>
            <button style={loginButtonStyle} onClick={OnLoginButtonClick}>Login</button>
            <button style={signupButtonStyle} onClick={OnSignUpButtonClick}>Sign up</button>

			{showLoginPopup && (
        		<div style={loginPopupStyle}>
          		<p style={popUpTitleStyle}>Login</p>
          		<form>
					<input
					type="text"
					placeholder="Username"
					value={username}
              		onChange={(e) => setUsername(e.target.value)} // Update state on change
					style={formFieldStyle}
					/>
				</form>
				<form>
					<input
					type="password"
					placeholder="Password"
					value={password}
              		onChange={(e) => setPassword(e.target.value)} // Update state on change
					style={formFieldStyle}
					/>
				</form>
          		<button style={popUpLoginButtonStyle} onClick={handleLogin}>Login</button>
        		</div>
      		)}

			{showSignupPopup && (
        		<div style={signupPopupStyle}>
          			<p style={popUpTitleStyle}>Sign Up</p>
          			<form>
						<input
						type="text"
						placeholder="Username"
						value={newUsername}
              			onChange={(e) => setNewUsername(e.target.value)} // Update state on change
						style={formFieldStyle}
						/>
						<input
						type="password"
						placeholder="Password"
						value={newPassword}
              			onChange={(e) => setNewPassword(e.target.value)} // Update state on change
						style={formFieldStyle}
						/>
					</form>
          			<button style={popUpSignupButtonStyle} onClick={handleSignUp}>Sign up</button>
        		</div>
      		)}

          </div>);
};

export default LogIn;
>>>>>>> main:pong_frontend/src/components/LogIn.tsx
