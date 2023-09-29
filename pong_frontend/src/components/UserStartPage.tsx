import { Link, Outlet } from 'react-router-dom';
import * as styles from './UserStartPageStyles';

interface UserStartPageProps {
	/* Declare page properties here if needed */
}

const UserStartPage: React.FC<UserStartPageProps> = ({/* Use UserStartPageProps here */}) => {

	const navigationLinks: { path: string; label: string}[] = [
		{ path: '/app/home', label: 'Home'},
		{ path: '/app/chat', label: 'Arena'},
		{ path: '/app/leaderboard', label: 'Leaderboard'},
		{ path: '/app/profile', label: 'Profile'},
		{ path: '/app/friends', label: 'My Friends'},
		{ path: '/app/settings', label: 'Settings'},
        { path: '/app/match_history', label: 'Match History'}
	];

	return (
		<div style={styles.pageStyle}>
			<header style={styles.headerStyle}>
        		{
					navigationLinks.map((link) => (
          				<Link key={link.path} style={styles.buttonStyle} to={link.path}>{link.label}</Link>
        			))
				}
      		</header>
	  		<div style={styles.subPageDimensions}>
	  			<Outlet />
      		</div>
		</div>
	);
};

export default UserStartPage;
