import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Navigate, Routes } from 'react-router-dom';
import { useUserContext } from './components/context/UserContext';
import LoginPage from './components/auth/LoginPage';
import CompleteProfilePage from './components/auth/CompleteProfilePage';
import UserStartPage from './components/UserStartPage';
import HomePage from './components/mainPages/HomePage';
import ArenaChat from './components/mainPages/Arena_Chat';
import LeaderboardPage from './components/mainPages/LeaderboardPage';
import ProfilePage from './components/mainPages/ProfilePage';
import SettingsPage from './components/mainPages/SettingsPage';
import MatchHistoryMainDiv from './components/main_div/MatchHistoryMainDiv';
import TFASetup from './components/auth/TFASetup';
import AuthRedirectPage from './components/auth/AuthRedirectPage';
import PublicProfileMainDiv from './components/main_div/PublicProfileMainDiv';
import TFAVerification from './components/auth/TFAVerification';
import MyFriendsPage from './components/mainPages/MyFriends';

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
                <Route path="app/logout" element={<Navigate to="/login" state={{ logout: true }} />} />
                <Route path="/complete_profile" element={<CompleteProfilePage />} />
                <Route path="/auth_redirect" element={<AuthRedirectPage />} />
                <Route path='/setup-2fa' element={<TFASetup />} />
                <Route path='/verify-2fa' element={<TFAVerification />} />
                <Route path="/app" element={<UserStartPage />}>
                <Route path='home' index element={<HomePage />} />
                <Route path="chat" element={<ArenaChat userID={user?.userID} friend_set={friend_set}/>} />
                <Route path="leaderboard" element={<LeaderboardPage friend_set={friend_set} loggedInUsername={user?.username}/>} />
                <Route path="profile" element={<ProfilePage friend_set={friend_set} />} />
                <Route path="friends" element={<MyFriendsPage friend_set={friend_set} />} />
                <Route path="/app/public_profile/:friend_ID"  element={<PublicProfileMainDiv friend_ID={friendID} />} />
                <Route path="match_history" element={<MatchHistoryMainDiv userID={user?.userID} friend_set={friend_set} />} />
                <Route path="settings" element={<SettingsPage onLogout={handleLogout} />} />    
                </Route>
            </Routes>
        </Router>
    );
};

export default App;

