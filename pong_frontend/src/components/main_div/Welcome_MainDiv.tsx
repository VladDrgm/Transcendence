import React from 'react';
import { User } from '../../interfaces/user.interface';
import CSS from 'csstype';

type WelcomeMainDivProps = {
	user: User;
}

const welcomeTitleStyle: CSS.Properties = {
	color: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	textAlign: 'center',
	top: '8px',
	padding: '4px',
	fontFamily: 'Shlop',
	fontSize: '40px',
  };

const Welcome_MainDiv: React.FC<WelcomeMainDivProps> = ({ user }) => {
    return (<div>
                <p style={welcomeTitleStyle}>Welcome {user.username} to the Horror Ping Pong</p>
            </div>)
};

export default Welcome_MainDiv;
