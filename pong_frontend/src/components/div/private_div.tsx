import React, { useEffect, useState, ChangeEvent  } from 'react';
import { PrivateProfile } from '../../interfaces/private_profile.interface';
import { getPrivateProfile } from '../../api/profile.api';
import defaultProfile from '../../default_profiile.jpg';

import { serialize } from 'v8';



const Private_Div = () => {
  const [profileUser, setProfileUser] = useState<PrivateProfile>();

  const getData = async () => {
    try{
      const myProf = await getPrivateProfile();
      setProfileUser(myProf);
    }
    catch (error) {
      console.error(error);
    // handle the error appropriately or ignore it
    }
  };
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

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
      if (profileUser != undefined)
      {
        var temp:PrivateProfile = profileUser;
        temp.avatar = imageUrl;
        setProfileUser(temp);
      }
      
    }
    catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (profileUser != null) {
    return (
      <div>
        <div>
          <h2>{profileUser.nickname}</h2>
          {(profileUser.avatar.substring(0, 5) != "https") && (
            <img src={defaultProfile} alt="default profile" width="400" height="300"/>
          )}
          {(profileUser.avatar.substring(0, 5) === "https") && (
            <img src={profileUser.avatar} alt={profileUser.nickname} width="400" height="300"/>
          )}
          <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={uploadImage}>Upload</button>
            {imageUrl && <img src={imageUrl} alt="Uploaded" />}
          </div>
          <p>Wins: {profileUser.wins}</p>
          <p>Losses: {profileUser.losses}</p>
          <p>Points: {profileUser.points}</p>
          <p>Status: {profileUser.status}</p>
          <p>Achievements: {profileUser.achievements}</p>
        </div>
      </div>
    );
  } 
  else {
    return <div></div>;
  }
};

export default Private_Div;
