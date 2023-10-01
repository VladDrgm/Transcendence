import React, { useState, useEffect } from 'react';
import PublicDiv from '../div/PublicDiv';
import FriendDiv from '../div/FriendDiv';
import { checkFriend, addFriend, removeFriend } from '../../api/friend_list.api';
import { useUserContext } from '../context/UserContext';
import { Link, useParams } from 'react-router-dom';
import { ButtonStyle } from '../div/UserProfileSyles';
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
  const [type, set_type] = useState<ProfileType_t | null>(null);
  const [blocked, set_blocked] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [reset, setReset] = useState(true);
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

  const isBlocked = async () => {
    const ret = await getBlockedUser(userID ,Number(friend_ID), user!);
    set_blocked(ret);
  };

  const addFriend_private = async () => {
    try {
      await addFriend(userID, Number(friend_ID), user?.intraUsername, user?.passwordHash);
      setReset(true);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFriend_private = async () => {
    try {
      await removeFriend(userID, Number(friend_ID), user?.intraUsername, user?.passwordHash);
      setReset(true);
    } catch (error) {
      console.error(error);
    }
  };

  const blockUser = async () => {
    try {
      await postBlockedUser(Number(friend_ID), user!);
      setReset(true);
    } catch (error) {
      console.error(error);
    }
  };

  const unblockUser = async () => {
    try {
      await deleteBlockedUser(Number(friend_ID), user!);
      setReset(true);
    } catch (error) {
      console.error(error);
    }
    isFriend();
  };

  useEffect(() => {
    isBlocked();
    isFriend();
    setReset(false);
  }, );

  useEffect(() => {
    postUserStatus("Online", user!);
  }, []);

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
      { blocked === false  ? (
        <div>
          <button style={ButtonStyle} onClick={blockUser}>
            Block
          </button>
        </div>
      ) : (
        <button style={ButtonStyle} onClick={unblockUser}>
          Unblock
        </button>
      ) }
    </div>
  );
};

export default PublicProfileMainDiv;
