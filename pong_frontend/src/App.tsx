// import dotenv from 'dotenv';
// dotenv.config();

import React, {useState, useEffect} from 'react';
import LogIn from './components/LogIn';
import UserStartPage from './components/UserStartPage';
import { User } from './interfaces/user.interface';
import { UserContext } from './components/context/UserContext';

const emptyUserObject: User = {
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

const App = () => {
	const [user, setUser] = useState<User>(emptyUserObject);
  	const [userID, userID_set] = useState<number>(0);

  	const [loged_in, loged_in_set] = useState<boolean>(false);

	const storeUserInCookies = (newUser: User) => {
		const userJSON = JSON.stringify(newUser);
		localStorage.setItem('user', userJSON);
		setUser(newUser);
	}

	const handleLogout = () => {
		localStorage.removeItem('user');
    	setUser(emptyUserObject);
	}

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			// Deserialize the user object from JSON
			const parsedUser: User = JSON.parse(storedUser);
			setUser(parsedUser);
		}
	  }, []);
 
return (
	<UserContext.Provider value={{ user, setUser }}>
		<div>
			{user.userID <= 0
				? (<LogIn onSignUp={storeUserInCookies} userID_set={userID_set} loginDone_set={loged_in_set} />)
				: (<UserStartPage onLogout={handleLogout} id={userID} />)
			}
		</div>
	</UserContext.Provider>
)
  
};

export default App;