import React, { useState } from 'react';
import { fetchAddress } from './ChannelDiv';

interface UserProfilePictureProps {
  imagePath: string | null;
  onErrorCallback?: () => void;
  defaultImageSrc: string;
  imageStyle: React.CSSProperties;
  altText: string;
}

const UserProfilePicture: React.FC<UserProfilePictureProps> = ({
  imagePath,
  onErrorCallback,
  defaultImageSrc,
  imageStyle,
  altText,
}) => {
  const [profilePicture, setProfilePicture] = useState(false);

  const handleProfilePictureError = () => {
    setProfilePicture(true);
    if (onErrorCallback) {
      onErrorCallback();
    }
  };

  return (
    <img
      className='user-card__image'
      src={profilePicture || !imagePath ? defaultImageSrc : fetchAddress.slice(0, -1) + `${imagePath?.slice(1)}`}
      alt={altText}
      onError={handleProfilePictureError}
      style={imageStyle}
    />
  );
};

export default UserProfilePicture;
