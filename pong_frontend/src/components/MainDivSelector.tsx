import React, {useState} from 'react';
import Error_MainDiv from './main_div/Error_MainDiv';
import Welcome_MainDiv from './main_div/Welcome_MainDiv';
import Profile_MainDiv from './main_div/Profile_MainDiv';
import Leaderboard_MainDiv from './main_div/Leaderboard_MainDiv';
// import Chat_MainDiv from './main_div/Chat_MainDiv';
import Arena_Chat_MainDiv from './main_div/Arena_Chat';
import Settings_MainDiv from './main_div/Settings_MainDiv';
import MatchHistory_MainDiv from './main_div/MatchHistory_MainDiv';
import PublicProfile_MainDiv from './main_div/PublicProfile_MainDiv';
import { User } from '../interfaces/user.interface';
import { useUserContext } from './context/UserContext';

export enum main_div_mode_t {
  ERROR_PAGE = -1,
  HOME_PAGE = 0,
  GAMEARENA = 2,
  GAME = 3,
  PROFILE = 4,
  SETTINGS = 5,
  HISTORY = 6,
  PUBLIC_PROFILE = 7,
  LEADERBORAD = 8,
}

interface MainDivProps
{
	onLogout: () => void;
	userID: number;
	mode: main_div_mode_t;
	mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
}

const MainDivSelector: React.FC<MainDivProps> = ({onLogout, userID, mode, mode_set}) => {
	const {user} = useUserContext();
	var userID = user.userID;
  const [friendID, friend_set] = useState<number>(-1);
  switch (mode){
    case main_div_mode_t.HOME_PAGE:
      return (<Welcome_MainDiv/>);
	case main_div_mode_t.GAMEARENA:
		return (<Arena_Chat_MainDiv userID={userID}/>)
	case main_div_mode_t.PROFILE:
		return (<Profile_MainDiv userID={userID} mode_set={mode_set} friend_set={friend_set}/>);
	case main_div_mode_t.LEADERBORAD:
    return (<Leaderboard_MainDiv mode_set={mode_set} friend_set={friend_set}/>);
  case main_div_mode_t.HISTORY:
    return (<MatchHistory_MainDiv userID={userID} mode_set={mode_set} friend_set={friend_set}/> );
  case main_div_mode_t.PUBLIC_PROFILE:
    return (<PublicProfile_MainDiv userID={userID} mode_set={mode_set} friend_ID={friendID}/>);
	case main_div_mode_t.SETTINGS:
		return (<Settings_MainDiv onLogout={onLogout} userID={userID} mode_set={mode_set} />);
    default:
      mode_set(main_div_mode_t.ERROR_PAGE);
      return (<Error_MainDiv />);
  }
};

export default MainDivSelector;
