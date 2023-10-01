import React, { useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import * as styles from './HomePageStyles';
import { postUserStatus } from '../../api/statusUpdateAPI.api';

const HomePage: React.FC = () => {
	const { user } = useUserContext();

	useEffect(() => {
        postUserStatus("Online", user!);
    }, []);
    return (
		<div style={styles.pageStyle}>
			<p style={styles.welcomeTitleStyle}>Welcome {user?.username} to the Horror Ping Pong</p>
        </div>)
};

export default HomePage;
