import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { fetchAddress } from '../div/ChannelDiv';
import { updateAvatarApi, updateUsernameApi, enableTFA } from '../../api/userApi';
import { getPrivateProfile } from '../../api/profile.api';
import * as styles from './SettingsPageStyles';
import imageAssetUploadAvatar from '../assets/uploadAvatar.png'
import ErrorPopup from '../Popups/ErrorPopup';
import { postUserStatus } from '../../api/statusUpdateAPI.api';

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const { user, setUser } = useUserContext();
  const userID = user?.userID;

  const [newUsername, setNewUsername] = useState('');
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    user?.avatarPath
      ? fetchAddress.slice(0, -1) + user?.avatarPath?.slice(1)
      : '/default_pfp.png'
  );
  const [tfa_enabled, set_tfa_enabled] = useState<boolean>(false);
  const [reset, setReset] = useState(true);
  const [loading, setLoading] = useState(true);

  const [border, setImageBorder] = useState<string>('3px dahed rgba(255, 0, 0, 1)');
  

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleUpdateUsername = async () => {
    if (!(newUsername.trim().length !== 0)) {
      setError('Please put in a username to continue!');
      return;
    }
    let updatedUser = null;
    try {
      updatedUser = await updateUsernameApi(
        userID,
        newUsername,
        user?.intraUsername,
        user?.passwordHash
      );
      setNewUsername('');
    } catch (error) {
      setError('Error updating username. Try again!');
      return;
    }
    user!.username = updatedUser.username;
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleUpdateAvatar = async () => {
    try {
      if (!newAvatar) {
        setError('Please select an image to upload');
        return;
      }

      const formData = new FormData();
      formData.append('file', newAvatar);
      await updateAvatarApi(
        userID,
        formData,
        user?.intraUsername,
        user?.passwordHash
      );
      setImageBorder('3px solid #0071BB');
      setNewAvatar(null);
    } catch (error) {
      setError('Error updating avatar. Try again!');
      return;
    }
    const myProf = await getPrivateProfile(
      userID,
      user?.intraUsername,
      user?.passwordHash
    );
    user!.avatarPath = myProf.avatarPath;
    setUser(user);
    setSelectedImage(
      fetchAddress.slice(0, -1) + user?.avatarPath?.slice(1)
    );
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Extract the filename from the File object and update the state
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
		// Check the file size (e.g., limit to 1 MB)
		if (file.size > 1024 * 1024) {
			setError('Image size is too big!');
		} else {
			setNewAvatar(file);
			setSelectedImage(URL.createObjectURL(file));
			setImageBorder('3px solid rgba(254, 8, 16, 1)');
		}
    }
  };

  const OnLogoutButtonClick = async () => {
    onLogout();
    navigate(`/login`);
  };

  const isTfaEnabled = async () => {
    const ret = user?.is2FAEnabled ?? false;
    set_tfa_enabled(ret);
    setLoading(false);
  };

  const enableTfa = async () => {
    try {
      // await === @Time here call function that enables 2fa +++
      	setReset(true);
      	set_tfa_enabled(true);
		navigate(`/setup-2fa`);
    } catch (error) {
      console.error(error);
    }
  };

  const disableTfa = async () => {
    try {
      // await === @Time here call function that disables 2fa +++
	  const updatedUser = await enableTFA(user?.userID, "0", user?.intraUsername, user?.passwordHash, false);
	  user!.is2FAEnabled = updatedUser.is2FAEnabled;
	  user!.tfa_secret = updatedUser.tfa_secret;
	  setUser(user);

      setReset(true);
      set_tfa_enabled(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      isTfaEnabled();
      setReset(false);
    }, 1000); // Delay in milliseconds (e.g., 1000ms = 1 second)
    return () => clearTimeout(timer);
  }, [reset]);

  useEffect(() => {
	// Check if the user is logged in when the component mounts
	if (!user) {
		navigate('/login'); // Redirect to the login page if not logged in
	}
    postUserStatus('Online', user!);
    isTfaEnabled();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div style={styles.pageStyle}>
      <p style={styles.settingsTitleStyle}>Settings</p>
      {selectedImage && (
        <img
          className='user-card__image'
          src={selectedImage}
          alt='user.avatarPath'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = '/default_pfp.png';
          }}
          style={{ ...styles.profilePictureStyle, border }}
        />
      )}
      <div style={styles.uploadContainer}>
        <label style={styles.customAvatarUploadButtonStyle}>
          <input type='file' accept=".jpg, .jpeg, .png" onChange={handleAvatarChange} style={styles.avatarInputFieldStyle} />
          <img src={imageAssetUploadAvatar} style={styles.imageUploadButtonIconStyle} alt='' />
          Upload file from computer
        </label>
        <button style={styles.updateButtonStyle} onClick={handleUpdateAvatar}>
          Update avatar
        </button>
      </div>
      <br />
      <div style={styles.inputContainer}>
        <input
          type='text'
          maxLength={15}
          placeholder={user?.username}
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          style={styles.formFieldStyle}
        />
        <button style={styles.updateButtonStyle} onClick={handleUpdateUsername}>
          Update username
        </button>
      </div>
      {tfa_enabled === false  ? (
        <div>
          <button style={styles.updateButtonStyle} onClick={enableTfa}>
            Enable 2fa
          </button>
        </div>
      ) : (
        <button style={styles.updateButtonStyle} onClick={disableTfa}>
          Disable 2fa
        </button>
      ) }
      <button style={styles.logoutButtonStyle} onClick={OnLogoutButtonClick}>
        Log Out
      </button>
      <ErrorPopup message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default SettingsPage;
