import React, { createContext, useState, ReactNode } from 'react';
import { Channel } from './channel.interface';

export interface User {
	username: string,
	intraUsername: string,
	userID: number,
	socketId: string,
	avatarPath: string,
	wins: number,
	losses: number,
	points: number,
	status: string,
	achievementsCSV: string,
	passwordHash: string,
	friends: User[],
	befriendedBy: User[],
	blocked: User[],
	blockedBy: User[],
	adminChannels: Channel[],
	blockedChannels: Channel[],
	channels: Channel[],
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface CreateUserProps {
	onUserCreated: (user: User) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
