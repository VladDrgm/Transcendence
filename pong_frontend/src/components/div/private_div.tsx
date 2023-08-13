import React, { useEffect, useState, ChangeEvent  } from 'react';
import { PrivateProfile } from '../../interfaces/private_profile.interface';
import { getPrivateProfile } from '../../api/profile.api';
import { changeUsername } from '../../api/change_username';
import CSS from 'csstype';

interface PrivateDivProps
{
  userID: number;
}

const Private_Div: React.FC<PrivateDivProps> = ({userID}) => {
  const [user, setUser] = useState<PrivateProfile>();

  const profilePictureStyle: CSS.Properties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '20px',
    border: '3px solid rgba(254, 8, 16, 1)',
  };

  const getData = async () => {
    try{
      const myProf = await getPrivateProfile(userID);
      setUser(myProf);
    }
    catch (error) {
      console.error(error);
    // handle the error appropriately or ignore it
    }
  };
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleButtonClick = () => {
    const data = { text: inputText };
    changeUsername(userID, data.text);
    setInputText(''); // Clear the input field after submitting
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setImage(file || null);
  };
  const uploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=6e1ea064ae12a72d44cf9fa845c2c6f6', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data && data.data && data.data.image && data.data.image.url) {
        setImageUrl(data.data.image.url);
        /* Insert API method for image change (POST image link to our database) */
      }
      if (user != undefined)
      {
        var temp:PrivateProfile = user;
        temp.avatarPath = imageUrl;
        setUser(temp);
      }
      
    }
    catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [handleButtonClick]);

  if (user != null) {
    return (
      <div>
        <div>
          <h1>Personal profile</h1> 
          <h2>{user.username}</h2> 
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
          <p>Wins: {user.wins}</p>
          <p>Losses: {user.losses}</p>
          <p>Points: {user.points}</p>
          <p>Status: {user.status}</p>
          <p>Achievements: {user.achievementsCSV}</p>
        </div>
      </div>
    );
  } 
  else {
    return <div></div>;
  }
};

export default Private_Div;
