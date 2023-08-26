import React from 'react';
import { useUserContext } from '../context/UserContext';
import * as styles from './HomePageStyles';

const HomePage: React.FC = () => {
	const { user } = useUserContext();

    return (
		<div style={styles.pageStyle}>
			<p style={styles.welcomeTitleStyle}>Welcome {user?.username} to the Horror Ping Pong</p>
        </div>)
};

export default HomePage;
