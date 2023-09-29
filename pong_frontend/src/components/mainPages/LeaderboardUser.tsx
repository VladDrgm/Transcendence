import * as styles from './LeaderboardPageStyles';
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../interfaces/user.interface';

interface LeaderboardUserProps {
  user: User;
  index: number;
  loggedInUser: string | undefined;
  openFriend: (FID: number) => void;
}

const LeaderboardUser: React.FC<LeaderboardUserProps> = ({ user, index, loggedInUser, openFriend }) => {

  return (
    <td>
      {index < 3 ? (
        <div style={styles.userContainer}>
          <div style={styles.circularImage}>
            <img
              src={`/winner.png`}
              alt={`Winner`}
              style={styles.profilePicture}
            />
          </div>
          <div style={styles.username}>
          <Link
              to={loggedInUser === user.username ? "/app/profile" : `/app/public_profile/${user.userID}`}
              onClick={() => {
                if (loggedInUser !== user.username) {
                  openFriend(user.userID);
                }
              }}
            >
              {user.username}
            </Link>
          </div>
        </div>
      ) : (
        <div style={styles.userContainer}>
          <div style={styles.circularImage}>
            <img
              src={`/looser.png`}
              alt={`Other`}
              style={styles.profilePicture}
            />
          </div>
          <div style={styles.username}>
            <Link
              to={loggedInUser === user.username ? "/app/profile" : `/app/public_profile/${user.userID}`}
              onClick={() => {
                if (loggedInUser !== user.username) {
                  openFriend(user.userID);
                }
              }}
            >
              {user.username}
            </Link>
          </div>
        </div>
      )}
    </td>
  );
};

export default LeaderboardUser;
