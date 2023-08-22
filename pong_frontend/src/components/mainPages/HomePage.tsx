import React from 'react';
import { useUserContext } from '../context/UserContext';
import * as styles from './HomePageStyles';

const HomePage: React.FC = () => {
	const { user } = useUserContext();
    return (<div>
				{ user ? (<p style={styles.welcomeTitleStyle}>Welcome {user.username} {user.userID} to the Horror Ping Pong</p>)
					   : (<p style={styles.welcomeTitleStyle}>Intruder detected</p>)
				}
            </div>)
};

export default HomePage;
