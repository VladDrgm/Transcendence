import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userSignupAPI } from '../../api/authAPI';
import { useUserContext } from '../context/UserContext';
import * as styles from './CompleteProfilePageStyles';
import imageAssetUploadAvatar from '../assets/uploadAvatar.png';
import { User } from '../../interfaces/User';
import { updateAvatarApi, updateUsernameApi } from '../../api/userApi';
import ErrorPopup from '../Popups/ErrorPopup';
import { postUserStatus } from '../../api/statusUpdateAPI.api';


const CompleteProfilePage: React.FC = () => {{
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

	useEffect(() => {
		// Check if the user is logged in when the component mounts
		if (!user && !intraName) {
		  navigate('/login'); // Redirect to the login page if not logged in
		}
	  }, [user, intraName, navigate]);
	  
	// Extract the filename from the File object and update the state
	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files ? e.target.files[0] : null;
		if (file) {
			if (file.size > 1024 * 1024) {
				setError('Image size is too big!');
			} else {
				setNewAvatar(file);
				setSelectedImage(URL.createObjectURL(file));
			}
		}
	};

	const handleCreatingUser = async () => {
		if (user === null && intraName !== undefined) {
			// Handle first-time login here, if needed
		  } else if (user?.intraUsername !== intraName) {
			setError('Unauthorized access');
			navigate('/');
			return;
		  }
		  
		if (newUsername.trim().length < 1 || newUsername.trim().length > 15) {
			setError('Please put in a username(max 15 characters) to continue!');
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
			token: '',
			tfa_secret: '',
		};

		try {
			var newCreatedUser: User = await userSignupAPI(newUser);
			if (newAvatar) {
				try {
					const formData = new FormData();
					formData.append('file', newAvatar);
					const userObjectWithAvatar = await updateAvatarApi(newCreatedUser.userID, formData, newCreatedUser.intraUsername, newCreatedUser.passwordHash);
					newCreatedUser.avatarPath = userObjectWithAvatar.avatarPath;
				} catch (error) {;}
			}
			localStorage.setItem('user', JSON.stringify(newCreatedUser));
			setUser(newCreatedUser);

			if (enable2FA) { 
				navigate(`/setup-2fa`);
			} else {
				if (await postUserStatus("Online", newCreatedUser) === true) {
					newCreatedUser.status = "Online";
					localStorage.setItem('user', JSON.stringify(newCreatedUser));
					setUser(newCreatedUser);
				}
				navigate(`/`);
			}
		} catch (error) {
			setError('Error creating a new user');
		}
	}

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
					<input type="file" accept=".jpg, .jpeg, .png" onChange={handleAvatarChange} style={styles.avatarInputFieldStyle}/>
					<img src={imageAssetUploadAvatar} style={styles.imageUploadButtonIconStyle} alt=""></img>
					Upload file from computer
				</label>
			</form>
			<form>
			<input
				type="text"
				placeholder='Type in a username'
				value={newUsername}
				onChange={(e) => setNewUsername(e.target.value)}
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
}
export default CompleteProfilePage;
