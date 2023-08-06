import React from 'react';
import { useUserContext } from '../context/UserContext';
import CSS from 'csstype';

const welcomeTitleStyle: CSS.Properties = {
	color: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	textAlign: 'center',
	top: '8px',
	padding: '4px',
	fontFamily: 'Shlop',
	fontSize: '40px',
  };

const Welcome_MainDiv: React.FC = () => {
	const { user } = useUserContext();
    return (<div>
				{ user ? (<p style={welcomeTitleStyle}>Welcome {user.username} {user.userID} to the Horror Ping Pong</p>)
					   : (<p style={welcomeTitleStyle}>Intruder detected</p>)
				}
            </div>)
};

export default Welcome_MainDiv;
