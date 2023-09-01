// UserContext.tsx
import { createContext, useContext, useState } from 'react';
import { User } from '../../interfaces/user.interface';
import React from 'react';

interface UserContextValue {
	user: User | null;
	setUser: (user: User | null) => void;
  }

const UserContext = createContext<UserContextValue>({
	user: null,
	setUser: () => {},
  });

  export function useUserContext() {
	return useContext(UserContext);
  }

  interface UserContextProviderProps {
	children: React.ReactNode;
  }
  
  export const UserContextProvider: React.FC<UserContextProviderProps> = ({children}) => {
	const storedUser = localStorage.getItem('user');
	const initialUser: User | null = storedUser ? JSON.parse(storedUser) : null;

	const [user, setUser] = useState<User | null>(initialUser);
  
	return (
	  <UserContext.Provider value={{ user, setUser }}>
		{children}
	  </UserContext.Provider>
	);
  };
