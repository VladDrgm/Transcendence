import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import * as styles from './UserStartPageStyles';

const UserStartPage: React.FC = () => {

	const navigate = useNavigate();

	const navigationLinks: { path: string; label: string}[] = [
		{ path: '/app/home', label: 'Home'},
		{ path: '/app/chat', label: 'Arena'},
		{ path: '/app/leaderboard', label: 'Leaderboard'},
		{ path: '/app/profile', label: 'Profile'},
		{ path: '/app/friends', label: 'My Friends'},
        { path: '/app/match_history', label: 'Match History'},
        { path: '/app/logout', label: 'Log Out'},
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
