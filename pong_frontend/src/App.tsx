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
import Arena_Chat_MainDiv from './components/mainPages/Arena_Chat';

const App = () => {
	const { user, setUser } = useUserContext();

	const [friendID, friend_set] = useState<number>(-1);

	const storeUserInCookies = (newUser: User) => {
		const userJSON = JSON.stringify(newUser);
		localStorage.setItem('user', userJSON);
		setUser(newUser);
		console.log("Store new user in cookies callback", newUser.userID);
	}

	const handleLogout = () => {
		localStorage.removeItem('user');
    	setUser(null);
	}

	return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage onSignUp={storeUserInCookies} />} />
                <Route path="/complete_profile" element={<CompleteProfilePage onSignUp={storeUserInCookies} />} />
                <Route path="/app" element={<UserStartPage />}>
                    <Route index element={<HomePage />} /> {/* Makes this route default for /app */}
                    <Route path="chat" element={<Arena_Chat_MainDiv userID={user?.userID} friend_set={friend_set}/>} />
                    <Route path="leaderboard" element={<LeaderboardPage friend_set={friend_set}/>} />
                    <Route path="profile" element={<ProfilePage friend_set={friend_set} />} />
                    <Route path="settings" element={<SettingsPage onLogout={handleLogout} />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;

