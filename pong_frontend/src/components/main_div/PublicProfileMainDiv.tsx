import React, { useState, useEffect } from 'react';
import PublicDiv from '../div/PublicDiv';
import FriendDiv from '../div/FriendDiv';
import { checkFriend, addFriend, removeFriend } from '../../api/friend_list.api';
import { useUserContext } from '../context/UserContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ButtonStyle, BackButtonStyle } from '../div/UserProfileSyles';
import { postBlockedUser, deleteBlockedUser, getBlockedUser } from '../../api/block_user.api'
import { postUserStatus } from '../../api/statusUpdateAPI.api';

export enum ProfileType_t {
  FRIEND_PROFILE,
  PUBLIC_PROFILE,
}

interface ProfileProps {
  friend_ID: number;
}

const PublicProfileMainDiv: React.FC<ProfileProps> = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [type, set_type] = useState<ProfileType_t | null>(null);
  const [blocked, set_blocked] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [reset, setReset] = useState(true);
  const userID = user?.userID;
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

  const isBlocked = async () => {
    const ret = await getBlockedUser(userID ,Number(friend_ID), user!);
    set_blocked(ret);
  };

  const addFriend_private = async () => {
    try {
      await addFriend(userID, Number(friend_ID), user?.intraUsername, user?.passwordHash);
      setReset(true);
      set_type(ProfileType_t.FRIEND_PROFILE);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFriend_private = async () => {
    try {
      await removeFriend(userID, Number(friend_ID), user?.intraUsername, user?.passwordHash);
      setReset(true);
      set_type(ProfileType_t.PUBLIC_PROFILE);
    } catch (error) {
      console.error(error);
    }
  };

  const blockUser = async () => {
    try {
      await postBlockedUser(Number(friend_ID), user!);
      setReset(true);
      set_blocked(true);
    } catch (error) {
      console.error(error);
    }
  };

  const unblockUser = async () => {
    try {
      await deleteBlockedUser(Number(friend_ID), user!);
      setReset(true);
      set_blocked(false);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (!user) {
      console.log('Not logged in!');
      navigate('/login'); // Redirect to the login page if not logged in
      return;
    }
    const timer = setTimeout(() => {
      isBlocked();
      isFriend();
      setReset(false);
    }, 1000); // Delay in milliseconds (e.g., 1000ms = 1 second)
    return () => clearTimeout(timer);
  }, [reset]);

  useEffect(() => {
    postUserStatus("Online", user!);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
    <div>
      {type === ProfileType_t.FRIEND_PROFILE ? (
         <span>
          <FriendDiv userID={userID} friendID={Number(friend_ID)} />
          <button style={ButtonStyle} onClick={removeFriend_private}>
            Unfriend
          </button>
          </span>
      ) : (
        <span>
          <PublicDiv userID={userID} publicID={Number(friend_ID)} />
          <button style={ButtonStyle} onClick={addFriend_private}>
            Add Friend
          </button>
         </span>
      )}
      { blocked === false  ? (
          <button style={ButtonStyle} onClick={blockUser}>
            Block
          </button>
      ) : (
        <button style={ButtonStyle} onClick={unblockUser}>
          Unblock
        </button>
      ) }
      </div>
       <div>
          <Link to="/app/profile">
            <button style={BackButtonStyle}>Back to your profile</button>
          </Link>
      </div>
    </div>
  );
};

export default PublicProfileMainDiv;
