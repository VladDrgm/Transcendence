import { FC, useEffect, useState } from 'react';
import { IUser } from '../interfaces/interface';

export const UserList: FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
     fetch('http://localhost:3000/api/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
      
  }, []);
  
  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.userId}>
            <img src={user.avatar} alt={user.nickname} />
            <div>
              <h2>{user.nickname}</h2>
              <p>Wins: {user.wins}</p>
              <p>Losses: {user.losses}</p>
              <p>Ladder Level: {user.ladderLevel}</p>
              <p>Status: {user.status}</p>
              <p>Achievements: {user.achievements}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
