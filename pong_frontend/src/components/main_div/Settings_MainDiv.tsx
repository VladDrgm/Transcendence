import React, {useState, useEffect} from 'react';
import {main_div_mode_t} from '../MainDivSelector'
import Private_Div from '../div/private_div';
import { getMyID } from '../../api/profile.api';
import CSS from 'csstype';
import { User } from '../../interfaces/user.interface';

interface SettingsMainDivProps
{
  userID: number;
  user: User;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
}

const Settings_MainDiv: React.FC<SettingsMainDivProps> = ({user, userID, mode_set}) => {
	var fetchAddress = 'http://localhost:3000/user/';
	var slash = '/'
	var updatePasswordEndpoint = '/update/password';
	var updateUsernameEndpoint = '/update/username/';

	const [showUpdatePasswordSuccessMessage, setShowUpdatePasswordSuccessMessage] = useState(false);
	const [showUpdateUsernameSuccessMessage, setShowUpdateUsernameSuccessMessage] = useState(false);

	const [newPassword, setNewPassword] = useState(''); // Sign up state for password input
	const [newUsername, setNewUsername] = useState(''); // Sign up state for password input

const handleUpdatePassword = async () => {
	try {
		// Make API call and get the response
		const response = await fetch(fetchAddress + userID + slash + newPassword + updatePasswordEndpoint, {
			method:"PUT",
			headers: {
				"Content-Type": "application/json"
			},
		});
	
		if (response.ok) {
			setShowUpdatePasswordSuccessMessage(true);
		} else {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error('Error logging in. Try again!');
	}
	setShowUpdatePasswordSuccessMessage(false);
};

const handleUpdateUsername = async () => {
	try {
		// Make API call and get the response
		const response = await fetch(fetchAddress + userID + updateUsernameEndpoint + newUsername, {
			method:"PUT",
			headers: {
				"Content-Type": "application/json"
			},
		});
	
		if (response.ok) {
			setShowUpdateUsernameSuccessMessage(true);
		} else {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error('Error logging in. Try again!');
	}
	setShowUpdateUsernameSuccessMessage(false);
};

const OnLogoutButtonClick = async () => {
};

const settingsTitleStyle: CSS.Properties = {
	color: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	textAlign: 'center',
	top: '8px',
	padding: '4px',
	fontFamily: 'Shlop',
	fontSize: '40px',
}

const usernameFormFieldStyle: CSS.Properties = {
    padding: '8px',
    width: '200px',
    fontSize: '18px',
    borderRadius: '4px',
    border: '1px solid #fff',
	marginBottom: '13px',
	fontFamily: 'Shlop',
}

const passwordFormFieldStyle: CSS.Properties = {
    padding: '8px',
    width: '200px',
    fontSize: '18px',
    borderRadius: '4px',
    border: '1px solid #fff',
	marginBottom: '13px',
	fontFamily: 'Shlop',
}

const updateButtonStyle: CSS.Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'80px',
	fontFamily: 'Shlop',
	fontSize: '14px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	marginTop: '10px',
	marginLeft: '20px',
}

const successMessageStyle: CSS.Properties = {
	color: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	textAlign: 'center',
	top: '8px',
	padding: '4px',
	fontFamily: 'Shlop',
	fontSize: '12px',
}

const logoutButtonStyle: CSS.Properties = {
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

    return (<div>
              <div>
                <p style={settingsTitleStyle}>Settings</p>
				<form>
					<input
					type="text"
					placeholder={user.intraUsername}
					value={newUsername}
					onChange={(e) => setNewUsername(e.target.value)} // Update state on change
					style={usernameFormFieldStyle}
					/>
					{showUpdatePasswordSuccessMessage && (
						<p>Successfully update the password</p>
					)}
					<button style={updateButtonStyle} onClick={handleUpdateUsername}>Update</button>
				</form>
				<form>
					<input
					type="password"
					placeholder="Type in new password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)} // Update state on change
					style={passwordFormFieldStyle}
					/>
					{showUpdatePasswordSuccessMessage && (
						<p>Successfully update the password</p>
					)}
					<button style={updateButtonStyle} onClick={handleUpdatePassword}>Update</button>
				</form>
				<button style={logoutButtonStyle} onClick={OnLogoutButtonClick}>Logout</button>
              </div>
            </div>)
};

export default Settings_MainDiv;
