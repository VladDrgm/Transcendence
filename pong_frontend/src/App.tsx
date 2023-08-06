import React, {useState, useEffect} from 'react';
import { Route, BrowserRouter as Router, Navigate, Routes } from 'react-router-dom';
import { User } from './interfaces/user.interface';
import { UserContextProvider, useUserContext } from './components/context/UserContext';
import LoginPage from './components/LoginPage';
import CompleteProfilePage from './components/main_div/CompleteProfilePage';
import Welcome_MainDiv from './components/main_div/Welcome_MainDiv';
import Arena_Chat_MainDiv from './components/main_div/Arena_Chat';
import Profile_MainDiv from './components/main_div/Profile_MainDiv';
import UserStartPage from './components/UserStartPage';
import Error_MainDiv from './components/main_div/Error_MainDiv';
import Game from './components/main_div/Game';
import Leaderboard_MainDiv from './components/main_div/Leaderboard_MainDiv';
// import Chat_MainDiv from './main_div/Chat_MainDiv';
import SettingsPage from './components/main_div/SettingsPage';

const emptyUserObject: User = {
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

const App = () => {
	const { user, setUser } = useUserContext();
	// const [user, setUser] = useState<User>(emptyUserObject);
  	const [userID, userID_set] = useState<number>(0);

  	const [loged_in, loged_in_set] = useState<boolean>(false);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			// Deserialize the user object from JSON
			const parsedUser: User = JSON.parse(storedUser);
			setUser(parsedUser);
		}
	}, []);

	const storeUserInCookies = (newUser: User) => {
		const userJSON = JSON.stringify(newUser);
		localStorage.setItem('user', userJSON);
		setUser(newUser);
	}

	const handleLogout = () => {
		localStorage.removeItem('user');
    	setUser(emptyUserObject);
	}
 
	return (
		<UserContextProvider>
		  <Router>
			<Routes>
				<Route path='*' element={
					user ? <UserStartPage /> : <Navigate to="/login"/>
				}>
					<Route path="home" element={<div><Welcome_MainDiv /></div>} />
					<Route path="chat" element={<div><Arena_Chat_MainDiv userID={user.userID} /></div>} />
					{/* <Route path="game" element={<div><Game /></div>} /> */}
					<Route path="leaderboard" element={<div><Leaderboard_MainDiv /></div>} />
					<Route path="profile" element={<div><Profile_MainDiv userID={user.userID} /></div>} />
					<Route path="settings" element={<div><SettingsPage onLogout={handleLogout} userID={user.userID} /></div>} />
				</Route>
				<Route path='/login' element={<LoginPage onSignUp={storeUserInCookies} userID_set={userID_set} loginDone_set={loged_in_set} />}/>
				<Route path='/complete_profile' element={<CompleteProfilePage userID={user.userID}/>}/>
			</Routes>
		  </Router>
		</UserContextProvider>
	  );
};

export default App;