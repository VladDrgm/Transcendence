import React, { FC, useEffect, useState } from 'react';
import { IUser } from '../interfaces/IUser';
import { getUsers } from '../api/userApi';

export const UserList: FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const getData = async() => {
    const users = await getUsers();
    setUsers(users);
  }

  useEffect(() => {
    getData()
  }, [])
  
  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.userID}>
            <img src={user.avatar} alt={user.username} />
            <div>
              <h2>{user.username}</h2>
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
