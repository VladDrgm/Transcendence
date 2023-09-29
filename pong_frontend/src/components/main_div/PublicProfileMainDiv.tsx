import React, { useState, useEffect } from 'react';
import PublicDiv from '../div/PublicDiv';
import FriendDiv from '../div/FriendDiv';
import { checkFriend, addFriend, removeFriend } from '../../api/friend_list.api';
import { useUserContext } from '../context/UserContext';
import { Link, useParams } from 'react-router-dom';
import { ButtonStyle } from '../div/UserProfileSyles';

export enum ProfileType_t {
  FRIEND_PROFILE,
  PUBLIC_PROFILE,
}

interface ProfileProps {
  friend_ID: number;
}

const PublicProfileMainDiv: React.FC<ProfileProps> = () => {
  const [type, set_type] = useState<ProfileType_t | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const userID = user!.userID;
  const { friend_ID } = useParams<{ friend_ID: string }>();

  const isFriend = async () => {
    try {
      const ret = await checkFriend(userID, Number(friend_ID), user?.intraUsername, user?.passwordHash);
      if (ret) {
        set_type(ProfileType_t.FRIEND_PROFILE);
      } else {
        set_type(ProfileType_t.PUBLIC_PROFILE);
      }
    } catch (error) {
      console.error(error);
    } finally {
    setLoading(false);
  }
  };

  const addFriend_private = async () => {
    try {
      await addFriend(userID, Number(friend_ID), user?.intraUsername, user?.passwordHash);
      isFriend();
    } catch (error) {
      console.error(error);
    }
  };

  const removeFriend_private = async () => {
    try {
      await removeFriend(userID, Number(friend_ID), user?.intraUsername, user?.passwordHash);
      isFriend();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    isFriend();
  }, [friend_ID]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {type === ProfileType_t.FRIEND_PROFILE ? (
        <div>
          <FriendDiv userID={userID} friendID={Number(friend_ID)} />
          <button style={ButtonStyle} onClick={removeFriend_private}>
            Unfriend
          </button>
          <Link to="/app/profile">
            <button style={ButtonStyle}>Back to your profile</button>
          </Link>
        </div>
      ) : (
        <div>
          <PublicDiv userID={userID} publicID={Number(friend_ID)} />
          <button style={ButtonStyle} onClick={addFriend_private}>
            Add Friend
          </button>
          <Link to="/app/profile">
            <button style={ButtonStyle}>Back to your profile</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PublicProfileMainDiv;
