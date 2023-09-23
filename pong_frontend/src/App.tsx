import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Navigate, Routes } from 'react-router-dom';
import { useUserContext } from './components/context/UserContext';
import LoginPage from './components/auth/LoginPage';
import CompleteProfilePage from './components/auth/CompleteProfilePage';
import UserStartPage from './components/UserStartPage';
import HomePage from './components/mainPages/HomePage';
import Arena_Chat_MainDiv from './components/mainPages/Arena_Chat';
import LeaderboardPage from './components/mainPages/LeaderboardPage';
import ProfilePage from './components/mainPages/ProfilePage';
import SettingsPage from './components/mainPages/SettingsPage';
import MatchHistory_MainDiv from './components/main_div/MatchHistory_MainDiv';
import PublicProfile_MainDiv from './components/main_div/PublicProfile_MainDiv';
import TFASetup from './components/auth/TFASetup';

const App = () => {
	const { user, setUser } = useUserContext();

	const [friendID, friend_set] = useState<number>(-1);

	const handleLogout = () => {
		localStorage.removeItem('user');
    	setUser(null);
	}

	return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/complete_profile" element={<CompleteProfilePage />} />
				<Route path='/setup-2fa' element={<TFASetup />} />
                <Route path="/app" element={<UserStartPage />}>
                    <Route path='home' index element={<HomePage />} />
                    <Route path="chat" element={<Arena_Chat_MainDiv userID={user?.userID} friend_set={friend_set}/>} />
                    <Route path="leaderboard" element={<LeaderboardPage friend_set={friend_set}/>} />
                    <Route path="profile" element={<ProfilePage friend_set={friend_set} />} />
                    <Route path="public_profile" element={<PublicProfile_MainDiv friend_ID={friendID} />} />
                    <Route path="match_history" element={<MatchHistory_MainDiv userID={user?.userID} friend_set={friend_set} />} />
                    <Route path="settings" element={<SettingsPage onLogout={handleLogout} />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;

