import React, {useState, useEffect} from 'react';
import { Route, BrowserRouter as Router, Navigate, Routes } from 'react-router-dom';
import { User } from './interfaces/user.interface';
import { UserContextProvider, useUserContext } from './components/context/UserContext';
import LoginPage from './components/LoginPage';
import CompleteProfilePage from './components/CompleteProfilePage';
import HomePage from './components/mainPages/HomePage';
// import Arena_Chat_MainDiv from './components/mainPages/Chat_MainDiv';
import ProfilePage from './components/mainPages/ProfilePage';
import UserStartPage from './components/UserStartPage';
import LeaderboardPage from './components/mainPages/LeaderboardPage';
import SettingsPage from './components/mainPages/SettingsPage';
import Chat_MainDiv from './components/mainPages/Chat_MainDiv';

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
	const { user, setUser } = useUserContext();

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			// Deserialize the user object from JSON
			const parsedUser: User = JSON.parse(storedUser);
			setUser(parsedUser);
			console.log("User Id from useEffect from localStorage", parsedUser.userID);
		}
	}, []);

	const storeUserInCookies = (newUser: User) => {
		const userJSON = JSON.stringify(newUser);
		localStorage.setItem('user', userJSON);
		setUser(newUser);
		console.log("Store new user in cookies callback", newUser.userID);
	}

	const handleLogout = () => {
		localStorage.removeItem('user');
    	setUser(emptyUserObject);
	}

	let content;

	if (user) {
		content = (
			<Route path="/" element={<UserStartPage />}>
					{/* Below are the child pages of UserStartPage and their paths */}
					<Route path="home" element={<HomePage />} />
					{/* <Route path="chat" element={<Chat_MainDiv userID={user.userID} />} /> */}
					{/* <Route path="game" element={<Game />} /> */}
					{/* <Route path="leaderboard" element={<LeaderboardPage />} /> */}
					{/* <Route path="profile" element={<ProfilePage userID={user.userID} />} /> */}
					<Route path="settings" element={<SettingsPage onLogout={handleLogout} userID={user.userID} />} />
				</Route>
		);
	} else {
		content = (
			<>
				<Route path='/login' element={<LoginPage onSignUp={storeUserInCookies} />} />
				<Route path='/complete_profile' element={<CompleteProfilePage onSignUp={storeUserInCookies}/>} />
			</>
		);
	}
 
	return (
		<UserContextProvider>
		  <Router>
			<Routes>
				<Route path="/" element={ user.userID > 0 ? <Navigate to="/app" /> : <Navigate to="/login" />}/>
					{/* Below are the child pages of UserStartPage and their paths */}
					<Route path="/app" element={<HomePage />}>
						<Route path="/app/home" element={<HomePage />} />
						{/* <Route path="chat" element={<Chat_MainDiv userID={user.userID} />} /> */}
						{/* <Route path="game" element={<Game />} /> */}
						{/* <Route path="leaderboard" element={<LeaderboardPage />} /> */}
						{/* <Route path="profile" element={<ProfilePage userID={user.userID} />} /> */}
						<Route path="/app/settings" element={<SettingsPage onLogout={handleLogout} userID={user.userID} />} />
					</Route>
				<Route path='/login' element={<LoginPage onSignUp={storeUserInCookies} />} />
				<Route path='/complete_profile' element={<CompleteProfilePage onSignUp={storeUserInCookies}/>} />
			</Routes>
		  </Router>
		</UserContextProvider>
	  );
};

export default App;

