import React, { useRef, useState, useEffect } from 'react';
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
import { postUserStatus } from './api/statusUpdateAPI.api';
import { AppState } from "react-native";
import LogoutHandler from './components/main_div/LogOutHandler';

const App = () => {
	const appState = useRef(AppState.currentState);
  	const [appStateVisible, setAppStateVisible] = useState(appState.current);

	useEffect(() => {
		AppState.addEventListener("change", _handleAppStateChange);

		const localUser = localStorage.getItem('user');
		const localParsedUser = JSON.parse(localUser!);
		setUser(localParsedUser);
	
		return () => {
		//   AppState.removeEventListener("change", _handleAppStateChange);
		};
	  }, []);

	const { user, setUser } = useUserContext();

	const [friendID, friend_set] = useState<number>(-1);

	const handleLogout = async () => {
		const localUser = localStorage.getItem('user');
		const localParsedUser = JSON.parse(localUser!);
		if (localParsedUser != null) {
			await postUserStatus("Offline", localParsedUser);
		}
		localStorage.removeItem('user');
    	setUser(null);
	}

	const _handleAppStateChange = (nextAppState: any) => {
		const localUser = localStorage.getItem('user');
		const localParsedUser = JSON.parse(localUser!);
		if (
		  appState.current.match(/inactive|background/) &&
		  nextAppState === "active"
		) {
			if (localParsedUser != null) {
				postUserStatus("Online", localParsedUser);
			}
		} else {
			if (localParsedUser != null) {
				postUserStatus("Offline", localParsedUser);
			}
		}
	
		appState.current = nextAppState;
		setAppStateVisible(appState.current);
		console.log("AppState", appState.current);
	  };

	window.addEventListener("beforeunload", (ev) => {  
		const localUser = localStorage.getItem('user');
		const localParsedUser = JSON.parse(localUser!);
		if (localParsedUser != null) {
			postUserStatus("Online", localParsedUser);
		}
	});

	return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/app/home" replace /> : <Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
				<Route path="app/logout" element={<LogoutHandler onLogout={handleLogout} />}/>
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

