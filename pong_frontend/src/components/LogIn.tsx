import React, {useRef} from 'react';
import { login } from '../api/login.api';
import CSS from 'csstype';

interface LogInProps
{
  userID_set: React.Dispatch<React.SetStateAction<number>>;
  loginDone_set: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogIn: React.FC<LogInProps> = ({userID_set, loginDone_set}) => {
  const input_id = useRef<HTMLInputElement>(null);

const pageStyle: CSS.Properties = {
	backgroundColor: 'rgba(150, 0, 0, 1)',
	height: '100%',
	width: '100%',
	position: 'absolute',
}

const welcomeTitleStyle: CSS.Properties = {
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'rgba(255, 255, 255, 1)',
  position: 'relative',
  textAlign: 'center',
  top: '2rem',
  padding: '1.5rem',
  fontFamily: 'sans-serif',
  fontSize: '1.5rem',
//   boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
};

const loginTitleStyle: CSS.Properties = {
	color: 'rgba(255, 255, 255, 1)',
	position: 'relative',
	textAlign: 'center',
	top: '2rem',
	fontFamily: 'sans-serif',
	fontSize: '1rem',
}

const idNumberTitleStyle: CSS.Properties = {
	color: 'rgba(255, 255, 255, 1)',
	position: 'relative',
	textAlign: 'center',
	top: '2rem',
	fontFamily: 'sans-serif',
	fontSize: '1rem',
}

const textFieldStyle: CSS.Properties = {
	position: 'relative',
	textAlign: 'center',
	top: '2rem',
	fontFamily: 'sans-serif',
	fontSize: '1rem',
}

const loginButtonStyle: CSS.Properties = {
	position: 'relative',
	textAlign: 'center',
	top: '2rem',
	fontFamily: 'sans-serif',
	fontSize: '1rem',
}

const registerButtonStyle: CSS.Properties = {
	position: 'relative',
	textAlign: 'center',
	top: '2rem',
	fontFamily: 'sans-serif',
	fontSize: '1rem',
}

  async function saveUser_id() {
    if (input_id.current != null)
    {
      const parsedInput = parseInt(input_id.current.value);
      if (!isNaN(parsedInput))
      {
        await login(parsedInput);
        userID_set(parseInt(input_id.current.value));
        loginDone_set(true);
      }
      input_id.current.value = '';
    }
  };
  return (<div style={pageStyle}>
            <p style={welcomeTitleStyle}>Do you want to play a game?</p>
            <p style={loginTitleStyle}>Login or create user.</p>
            <div style={idNumberTitleStyle}>Id number:</div>
            <input style={textFieldStyle} ref={input_id} type="text" />
            <button style={loginButtonStyle} onClick={saveUser_id}>Log In</button>
            <br />
            <button style={registerButtonStyle}>Register</button>
          </div>);
};

export default LogIn;
