// Imports
import { Link, Outlet } from 'react-router-dom';
import { useUserContext } from './context/UserContext';
import * as styles from './UserStartPageStyles';
import HomePage from './mainPages/HomePage';

// Page properties
interface UserStartPageProps {
	/* Declar page properties here if needed */
}

// Component
const UserStartPage: React.FC<UserStartPageProps> = ({/* Use UserStartPageProps here */}) => {
	const { user } = useUserContext();

	const navigationLinks: { path: string; label: string}[] = [
		{ path: 'app/home', label: 'Home'},
		{ path: 'app/friends', label: 'Friends'},
		{ path: 'app/chat', label: 'Chat'},
		{ path: 'app/game', label: 'Game'},
		{ path: 'app/profile', label: 'Profile'},
		{ path: 'app/settings', label: 'Settings'},
	];

	return (
		<div style={styles.pageStyle}>
			<header>
        		{
					navigationLinks.map((link) => (
          				<Link key={link.path} style={styles.buttonStyle} to={link.path}>{link.label}</Link>
        			))
				}
      		</header>
	  		<div style={styles.subPageDimensions}>
	  			<Outlet /> {/* This will render the nested routes */}
      		</div>
		</div>
	);
};

export default UserStartPage;
