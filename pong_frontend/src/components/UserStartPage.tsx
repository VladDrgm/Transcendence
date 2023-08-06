// Imports
import { Link, Outlet } from 'react-router-dom';
import { useUserContext } from './context/UserContext';
import * as styles from './UserStartPageStyles';

// Page properties
interface UserStartPageProps {
	/* Declar page properties here if needed */
}

// Component
const UserStartPage: React.FC<UserStartPageProps> = ({/* Use UserStartPageProps here */}) => {
	const { user } = useUserContext();

	const navigationLinks: { path: string; label: string}[] = [
		{ path: '/home', label: 'Home'},
		{ path: '/friends', label: 'Friends'},
		{ path: '/chat', label: 'Chat'},
		{ path: '/game', label: 'Game'},
		{ path: '/profile', label: 'Profile'},
		{ path: '/settings', label: 'Settings'},
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
