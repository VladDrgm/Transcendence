import { FC, useEffect, useState } from 'react';
import { FriendProfile } from '../../interfaces/FriendProfile';
import { getFriendList } from '../../api/friend_list.api';
import { useUserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { fetchAddress } from './ChannelDiv';
import { profilePictureStyle } from './UserProfileSyles';
import { friendCardContainerStyle, friendCardStyle } from '../mainPages/MyFriendsStyles';

interface FriendProps {
  userID: number | undefined;
  friend_set: React.Dispatch<React.SetStateAction<number>>;
}

const FriendList: FC<FriendProps> = ({ userID, friend_set }) => {
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState(true); 

  const { user } = useUserContext();

  const getData = async () => {
    try {
      const users = await getFriendList(userID, user?.intraUsername, user?.passwordHash);
      setFriends(users);
      setLoading(false); 
    } catch (error) {
      console.error(error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const openFriend = (FID: number) => {
    friend_set(FID);
  };

  return (
    <div>
      <h3>Friends List</h3>
      {loading ? ( // Show loading indicator while data is being fetched
        <p>Loading...</p>
      ) : friends.length === 0 ? (
        <p>No friends added yet :)</p>
      ) : (
        <div style={friendCardContainerStyle}>
          {friends?.map((friend) => (
            <div key={friend.username} style={friendCardStyle}>
              <Link onClick={() => openFriend(friend.userID)} to={`/app/public_profile/${friend.userID}`}>
                <img
                  className='friend-card__image'
                  src={fetchAddress.slice(0, -1) + `${friend.avatarPath?.slice(1)}`}
                  alt={friend.username}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = '/default_pfp.png';
                  }}
                  style={profilePictureStyle}
                />
                <div>{friend.username}</div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
