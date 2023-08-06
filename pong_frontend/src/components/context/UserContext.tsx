// UserContext.tsx
import { createContext, useContext, useState } from 'react';
import { User } from '../../interfaces/user.interface';
import React from 'react';

interface UserContextValue {
	user: User; // Initial value should be of type User
	// setUser: React.Dispatch<React.SetStateAction<User>>;
	setUser: (user: User) => void;
  }

const initialUser: User = {
	username: '',
	intraUsername: '',
	userID: 0,
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

  // Create the context
const UserContext = createContext<UserContextValue>({
	user: initialUser,
	setUser: () => {},
  });
  
  // Create a custom hook for using the UserContext
  export function useUserContext() {
	return useContext(UserContext);
  }

  interface UserContextProviderProps {
	children: React.ReactNode;
  }
  
  // Create a UserContextProvider component to wrap your app with
  export const UserContextProvider: React.FC<UserContextProviderProps> = ({children}) => {
	const [user, setUser] = useState<User>(initialUser);
  
	return (
	  <UserContext.Provider value={{ user, setUser }}>
		{children}
	  </UserContext.Provider>
	);
  };

// export const UserContext = React.createContext<UserContextValue>({
// 	user: initialUser, // Initial value is the emptyUserObject
// 	setUser: () => {}, // Empty function for the initial context
// });

// export const useUserContext = () => useContext(UserContext);