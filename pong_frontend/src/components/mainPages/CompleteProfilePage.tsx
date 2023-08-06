import React, {useState} from 'react';
import { useUserContext } from '../context/UserContext';
import CSS from 'csstype';
import { User } from '../../interfaces/user.interface';
import { updateAvatarApi, updateUsernameApi } from '../../api/userApi';


// CSS
const pageTitleStyle: CSS.Properties = {
	color: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	textAlign: 'center',
	top: '8px',
	padding: '4px',
	fontFamily: 'Shlop',
	fontSize: '40px',
};

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

const logoutButtonStyle: CSS.Properties = {
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
	marginBottom: '0px',
}

// Page props
interface CompleteProfilePageProps {
	userID: number;
}

// Component
const CompleteProfilePage: React.FC<CompleteProfilePageProps> = ({userID}) => {
	const { user, setUser } = useUserContext();

	const [updatedUser, setUpdatedUser] = useState<User>(user);
	const [newUsername, setNewUsername] = useState(''); // Sign up state for password input
	const [newAvatar, setNewAvatar] = useState<File | null>(null)

	const [showUpdateUsernameSuccessMessage, setShowUpdateUsernameSuccessMessage] = useState(false);
	const [showUpdateAvatarSuccessMessage, setShowUpdateAvatarSuccessMessage] = useState(false);

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

		  setShowUpdateUsernameSuccessMessage(true);
		} catch (error) {
		  throw new Error('Error updating username. Try again!');
		}
		setShowUpdateUsernameSuccessMessage(false);
	  };

	  const handleUpdateAvatar = async () => {
		try {
		  if (!newAvatar) {
			throw new Error('Please select an image to upload');
		  }
	
		  const formData = new FormData();
          formData.append('img', newAvatar);
		  const userObject = await updateAvatarApi(userID, formData);
		  setUpdatedUser(userObject);
		  setUser(userObject);
		  localStorage.setItem('user', JSON.stringify(userObject));
		  setShowUpdateAvatarSuccessMessage(true);
		} catch (error) {
		  throw new Error('Error updating avatar. Try again!');
		}
		setShowUpdateAvatarSuccessMessage(false);
	  };

	// Extract the filename from the File object and update the state
	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		console.log('Selected file:', file);
		if (file) {
			setNewAvatar(file);
		}
	};

    return (<div>
				<div>
					<p style={settingsTitleStyle}>Complete your profile</p>
					<img
						className='user-card__image'
						src={`http://localhost:3000/avatars/${user.avatarPath}`}
						alt='user.avatarPath'
						onError={({ currentTarget }) => {
							currentTarget.onerror = null;
							currentTarget.src = '/default_pfp.png';
						}}
						style={profilePictureStyle}
						/>
					<form>
					<input
						type="text"
						placeholder={user.intraUsername}
						value={newUsername}
						onChange={(e) => setNewUsername(e.target.value)} // Update state on change
						style={FormFieldStyle}
					/>
					{showUpdateUsernameSuccessMessage && <p>Successfully update the username</p>}
					<button style={updateButtonStyle} onClick={handleUpdateUsername}>
						Update
					</button>
					</form>
					<form>
					<input type="file" onChange={handleAvatarChange} style={FormFieldStyle}/>
					{showUpdateAvatarSuccessMessage && <p>Successfully update the avatar</p>}
					<button style={updateButtonStyle} onClick={handleUpdateAvatar}>
						Update
					</button>
					</form>
				</div>
            </div>)
};

export default CompleteProfilePage;
