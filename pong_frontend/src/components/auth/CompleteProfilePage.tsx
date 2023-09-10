import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userSignupAPI } from '../../api/authAPI';
import { useUserContext } from '../context/UserContext';
import * as styles from './CompleteProfilePageStyles';
import imageAssetUploadAvatar from '../assets/uploadAvatar.png';
import { User } from '../../interfaces/user.interface';
import { updateAvatarApi, updateUsernameApi } from '../../api/userApi';
import { fetchAddress } from '../div/channel_div';
import ErrorPopup from '../Popups/ErrorPopup';

interface CompleteProfilePageProps {
	/* Declare page properties here if needed */
}

const CompleteProfilePage: React.FC<CompleteProfilePageProps> = ({/* Use CompleteProfilePageProps here */}) => {
	const { user, setUser } = useUserContext();
	const navigate = useNavigate();
	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);
	const intraName = queryParams.get('intraName');

	const [newUsername, setNewUsername] = useState('');
	const [newAvatar, setNewAvatar] = useState<File | null>(null);
	const [enable2FA, setEnable2FA] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedImage, setSelectedImage] = useState<string>('/default_pfp.png');


	// Extract the filename from the File object and update the state
	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		console.log('Selected file:', file);
		if (file) {
			setNewAvatar(file);
			setSelectedImage(URL.createObjectURL(file));
		}
	};

	const handleCreatingUser = async () => {
		if (!(newUsername.trim().length !== 0)) {
			setError('Please put in a username to continue!');
  			return;
		}
		const newUser: User = {
			username: newUsername,
			intraUsername: intraName!,
			userID: 0,
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
			socketId: '',
			is2FAEnabled: enable2FA,
		};

		try {
			var newCreatedUser: User = await userSignupAPI(newUser);
			if (newAvatar) {
				try {
					const formData = new FormData();
					formData.append('file', newAvatar);
					const userObjectWithAvatar = await updateAvatarApi(newCreatedUser.userID, formData);
					newCreatedUser = userObjectWithAvatar;
				} catch (error) {
					setError('Error uploading avatar');
				}
			}
            if (newUsername) {
                try {
                    const updatedUser = await updateUsernameApi(newCreatedUser.userID, newUsername);
                    newCreatedUser = updatedUser;
                } catch (error) {
                    setError('Error uploading username');
                }
            }
			localStorage.setItem('user', JSON.stringify(newCreatedUser));
			setUser(newCreatedUser);

			if (enable2FA) { navigate(`/setup-2fa`); } 
			else { navigate(`/`); }
		} catch (error) {
			setError('Error creating a new user');
		}
	}

	//   const handleUpdateAvatar = async () => {
	// 	try {
	// 	  if (!newAvatar) {
	// 		throw new Error('Please select an image to upload');
	// 	  }
	
	// 	  const formData = new FormData();
    //       formData.append('img', newAvatar);
		//   const userObject = await updateAvatarApi(userID, formData);
		//   setUpdatedUser(userObject);
		//   setUser(userObject);
		//   localStorage.setItem('user', JSON.stringify(userObject));
	// 	} catch (error) {
	// 	  throw new Error('Error updating avatar. Try again!');
	// 	}
	//   };

    return (
		<div style={styles.pageStyle} >
			<p style={styles.pageTitleStyle}>Complete your profile {intraName}</p>
			<img
				className='user-card__image'
				src={selectedImage}
				alt='user.avatarPath'
				onError={({ currentTarget }) => {
					currentTarget.onerror = null;
					currentTarget.src = '/default_pfp.png';
				}}
				style={styles.profilePictureStyle}
				/>
			<form>
				<label style={styles.customAvatarUploadButtonStyle}>
					<input type="file" onChange={handleAvatarChange} style={styles.avatarInputFieldStyle}/>
					<img src={imageAssetUploadAvatar} style={styles.imageUploadButtonIconStyle}></img>
					Upload file from computer
				</label>
			</form>
			<form>
			<input
				type="text"
				placeholder='Type in a username'
				value={newUsername}
				onChange={(e) => setNewUsername(e.target.value)} // Update state on change
				style={styles.formFieldStyle}
			/>
			</form>
			<div style={styles.tfaCheckboxStyle}>
    			<input type="checkbox" onChange={e => setEnable2FA(e.target.checked)} />
    			<span style={styles.tfaLabelStyle}>Enable 2 Factor Authentication</span>
			</div>
			<button style={styles.completeProfileButtonStyle} onClick={handleCreatingUser}>Complete profile</button>
			<ErrorPopup message={error} onClose={() => setError(null)} />
		</div>
	)
};

export default CompleteProfilePage;
