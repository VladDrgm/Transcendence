// Imports
import { Link, Outlet } from 'react-router-dom';
import CSS from 'csstype';
import { useUserContext } from './context/UserContext';

// CSS
const pageStyle: CSS.Properties = {
	backgroundColor: 'rgba(3, 3, 3, 1)',
	height: '100%',
	width: '100%',
	position: 'absolute',
	alignItems: 'center',
	flexDirection: 'column',
	textAlign: 'center',
	borderColor: 'green',
	borderWidth: '5px',
}

const subPageDimensions: CSS.Properties = {
	width: '100%',
	height: '500px',
	backgroundColor: 'lightgray'
}

  const buttonStyle: CSS.Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'160px',
	fontFamily: 'Shlop',
	fontSize: '24px',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
	top:'4px',
	margin:'4px',
}

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
		<div style={pageStyle}>
			<header>
        		{
					navigationLinks.map((link) => (
          				<Link key={link.path} style={buttonStyle} to={link.path}>{link.label}</Link>
        			))
				}
      		</header>
	  		<div style={subPageDimensions}>
	  			<Outlet /> {/* This will render the nested routes */}
      		</div>
		</div>
	);
};

export default UserStartPage;
