import React, {useState} from 'react';
import {main_div_mode_t} from '../MainDivSelector'
import CSS from 'csstype';
import { User } from '../../interfaces/user.interface';
import { useUserContext } from '../context/UserContext';
import { updateAvatarApi, updatePasswordApi, updateUsernameApi } from '../../api/userApi';
import { getPrivateProfile } from '../../api/profile.api';
interface SettingsMainDivProps
{
	onLogout: () => void;
  	userID: number;
  	mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
}

const Settings_MainDiv: React.FC<SettingsMainDivProps> = ({onLogout, userID, mode_set}) => {
	const { user, setUser } = useUserContext();
	const [updatedUser, setUpdatedUser] = useState<User>(user);
	const [newPassword, setNewPassword] = useState(''); // Sign up state for password input
	const [newUsername, setNewUsername] = useState(''); // Sign up state for password input
	const [newAvatar, setNewAvatar] = useState<File | null>(null)

	const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
	const [ErrorMessage, setErrorMessage] = useState<string>('');
  
	//   // Add a conditional rendering to check if user is available
	//   if (!user || !user.avatarPath) {
	// 	// Return a loading state or null
	// 	return <p>Loading...</p>;
	//   }

	const handleUpdatePassword = async () => {
		try {
		  // Call the API function and get the updated user object
		  const userObject = await updatePasswordApi(userID, newPassword);
	  
		  // Update the state and local storage with the updated user object
		  setUpdatedUser(userObject);
		  setUser(userObject);
		  localStorage.setItem('user', JSON.stringify(userObject));
		  setShowErrorMessage(false);
		} catch (error) {
		  setErrorMessage('Error updating password. Try again!');
		  setShowErrorMessage(true);
		}
	  };

	  const handleUpdateUsername = async () => {
		try {
		  // Call the API function and get the updated user object
		  const updatedUser = await updateUsernameApi(userID, newUsername);
	  
		  // Update the state and local storage with the updated user object
		  setUpdatedUser(updatedUser);
		  setUser(updatedUser);
		  localStorage.setItem('user', JSON.stringify(updatedUser));
	  
		  // Clear the input field after successful update
		  setNewUsername('');
		  setShowErrorMessage(false);
		  
		} catch (error) {
		  setErrorMessage('Error updating username. Try again!');
		  setShowErrorMessage(true);
		}
		
	  };

	  const handleUpdateAvatar = async () => {
		try {
		  if (!newAvatar) {
			throw new Error('Please select an image to upload');
		  }
	
		  const formData = new FormData();
          formData.append('file', newAvatar);
		  await updateAvatarApi(userID, formData);
		  const myProf = await getPrivateProfile(userID);
		  setUpdatedUser(myProf);
		  setUser(myProf);
		  localStorage.setItem('user', JSON.stringify(myProf));
		  setNewAvatar(null);
		  setShowErrorMessage(false);
		} catch (error) {
		  setErrorMessage('Error updating avatar. Try again!');
		  setShowErrorMessage(true);
		}

	  };

	   // Extract the filename from the File object and update the state
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    console.log('Selected file:', file);
    if (file) {
      setNewAvatar(file);
    }
  };

const OnLogoutButtonClick = async () => {
	onLogout()

	console.log('User avatarPath:', user.avatarPath);

};

  // CSS for the profile picture
  const profilePictureStyle: CSS.Properties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '20px',
    border: '3px solid rgba(254, 8, 16, 1)',
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

const FormFieldStyle: CSS.Properties = {
    padding: '8px',
    width: '250px',
    fontSize: '18px',
    borderRadius: '4px',
    border: '1px solid #fff',
	marginBottom: '15px',
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

// const successMessageStyle: CSS.Properties = {
// 	color: 'rgba(254, 8, 16, 1)',
// 	position: 'relative',
// 	textAlign: 'center',
// 	top: '8px',
// 	padding: '4px',
// 	fontFamily: 'Shlop',
// 	fontSize: '12px',
// }

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
	marginBottom: '0px',
}

return (
	<div>
	  <div>
		<p style={settingsTitleStyle}>Settings</p>
		<img
			className='user-card__image'
			src={`http://localhost:3000${user.avatarPath.slice(1)}`}
			alt='user.avatarPath'
			onError={({ currentTarget }) => {
				currentTarget.onerror = null;
				currentTarget.src = '/default_pfp.png';
			}}
			style={profilePictureStyle}
			/>
			<br/>
		  <input
			type="text"
			placeholder={user.username}
			value={newUsername}
			onChange={(e) => setNewUsername(e.target.value)} // Update state on change
			style={FormFieldStyle}
		  />
		  <button style={updateButtonStyle} onClick={handleUpdateUsername}>
			Update
		  </button>
		  <input
			type="password"
			placeholder="Type in new password"
			value={newPassword}
			onChange={(e) => setNewPassword(e.target.value)} // Update state on change
			style={FormFieldStyle}
		  />
		  <button style={updateButtonStyle} onClick={handleUpdatePassword}>
			Update
		  </button>
		  <input type="file" onChange={handleAvatarChange} style={FormFieldStyle}/>
		  <button style={updateButtonStyle} onClick={handleUpdateAvatar}>
			Update
		  </button>
		  {showErrorMessage && <p>{ErrorMessage}</p>}
		<button style={logoutButtonStyle} onClick={OnLogoutButtonClick}>
		  Logout
		</button>
	  </div>
	</div>
  );
  
};

export default Settings_MainDiv;