import React, {useState} from 'react';
import MainDivSelector, {main_div_mode_t} from './MainDivSelector';
import CSS from 'csstype';
import { User } from '../interfaces/user.interface';
import { useUserContext } from './context/UserContext';


interface StartPageProps
{
	onLogout: () => void;
	id: number;
}

const UserStartPage: React.FC<StartPageProps> = ({onLogout, id}) => {
	const { user } = useUserContext();
  	const [mode, mode_set] = useState<main_div_mode_t>(main_div_mode_t.HOME_PAGE);

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

  return (<div style={pageStyle}>
            <header>
              <button style={buttonStyle} onClick={() => mode_set(main_div_mode_t.HOME_PAGE)}>Home</button>
              <button style={buttonStyle} onClick={() => mode_set(main_div_mode_t.CHAT)}>Chat</button>
              <button style={buttonStyle}>Play</button>
              <button style={buttonStyle} onClick={() => mode_set(main_div_mode_t.PROFILE)}>Profile</button>
			  <button style={buttonStyle} onClick={() => mode_set(main_div_mode_t.LEADERBORAD)}>Leaderboard</button>
              <button style={buttonStyle} onClick={() => mode_set(main_div_mode_t.HISTORY)}>Match History</button>
			  <button style={buttonStyle} onClick={() => mode_set(main_div_mode_t.SETTINGS)}>Settings</button>
            </header>
            <div style={{ width: '100%', height: '500px', backgroundColor: 'lightgray' }}>
              <MainDivSelector onLogout={onLogout} userID={id} mode={mode} mode_set={mode_set} />
            </div>
          </div>);
};

export default UserStartPage;
