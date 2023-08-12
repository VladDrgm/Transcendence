// UserContext.tsx
import { createContext, useContext, useState } from 'react';
import { User } from '../../interfaces/user.interface';

const initialUser: User = {
	username: '',
	intraUsername: '',
	userID: 0,
	socketId: '',
	avatarPath: '',
	wins: 0,
	losses: 0,
	points: 0,
	status: '',
	achievementsCSV: '',
	passwordHash: '',
	friends: [],
	befriendedBy: [],
	blocked: [],
	blockedBy: [],
	adminChannels: [],
	blockedChannels: [],
	channels: [],
  };

export const UserContext = createContext<{
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
}>({
	user: initialUser,
	setUser: () => {},
});

export const useUserContext = () => useContext(UserContext);