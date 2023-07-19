import React, { useRef, useContext, useState } from 'react';
import { login } from '../api/login.api';
import CSS from 'csstype';
import gif from './assets/billy.png'
import { UserContext, User } from '../interfaces/user.interface';

interface LogInProps
{
	onSignUp: (user: User) => void;
  	userID_set: React.Dispatch<React.SetStateAction<number>>;
  	loginDone_set: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogIn: React.FC<LogInProps> = ({onSignUp, userID_set, loginDone_set}) => {
  const input_id = useRef<HTMLInputElement>(null);
  var input_user_id;
  var fetchAddress = 'http://localhost:3000/';

const pageStyle: CSS.Properties = {
	backgroundColor: 'rgba(3, 3, 3, 1)',
	height: '100%',
	width: '100%',
	position: 'absolute',
	alignItems: 'center',
	flexDirection: 'column',
	textAlign: 'center',
}

const gifStyle: CSS.Properties = {
	position: 'relative',
	top: '40px',
	padding: '24px',
	width:'360px',
	height:'360px', 
  //   boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
  };

const welcomeTitleStyle: CSS.Properties = {
  color: 'rgba(254, 8, 16, 1)',
  position: 'relative',
  textAlign: 'center',
  top: '8px',
  padding: '4px',
  fontFamily: 'Shlop',
  fontSize: '80px',
};

const loginButtonStyle: CSS.Properties = {
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
}
  
	const handleSignUp = async () => {
		const newUser: User = {
			username: 'Tim',
			userID: 123,
			avatarPath: '',
			wins: 0,
			losses: 0,
			points: 0,
			status: '',
			achievementsCSV: '',
			passwordHash: '',
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
			const response = await fetch(fetchAddress + 'user', {
				// credentials: "include",
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
            <button style={loginButtonStyle} onClick={handleSignUp}>Sign up</button>
          </div>);
};

export default LogIn;
