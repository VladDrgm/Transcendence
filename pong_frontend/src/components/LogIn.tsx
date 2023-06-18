import React, {useRef} from 'react';
import { login } from '../api/login.api';
import CSS from 'csstype';
import gif from './assets/billy.png'

interface LogInProps
{
  userID_set: React.Dispatch<React.SetStateAction<number>>;
  loginDone_set: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogIn: React.FC<LogInProps> = ({userID_set, loginDone_set}) => {
  const input_id = useRef<HTMLInputElement>(null);
  var input_user_id;

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

const gifStyle: CSS.Properties = {
	position: 'relative',
	textAlign: 'center',
	top: '5rem',
	padding: '1.5rem',
	fontFamily: 'sans-serif',
	fontSize: '1.5rem',
	width:'360px',
	height:'360px', 
  //   boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
  };

const welcomeTitleStyle: CSS.Properties = {
  color: 'rgba(254, 8, 16, 1)',
  position: 'relative',
  textAlign: 'center',
  top: '2rem',
  padding: '1.5rem',
  fontFamily: 'Shlop',
  fontSize: '5rem',
};

const loginButtonStyle: CSS.Properties = {
	backgroundColor: 'rgba(254, 8, 16, 1)',
	position: 'relative',
	height:'40px',
	width:'160px',
	top: '4rem',
	fontFamily: 'Shlop',
	fontSize: '1.5rem',
	alignSelf: 'center',
	borderRadius: '6px',
	border: 'none',
	color:'white',
}

  async function saveUser_id() {
	input_user_id = 1
	if (input_user_id != 0)
    {
      if (!isNaN(input_user_id))
      {
        await login(input_user_id);
        userID_set(input_user_id);
        loginDone_set(true);
      }
      input_user_id = 0
    }
  };
  return (<div style={pageStyle}>
			<img src={gif} style={gifStyle} ></img>
            <p style={welcomeTitleStyle}>Do you want to play a game?</p>
            <button style={loginButtonStyle} onClick={saveUser_id}>Login with 42</button>
          </div>);
};

export default LogIn;
