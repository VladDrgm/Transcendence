import React from 'react';
import Error_MainDiv from './main_div/Error_MainDiv';
import Welcome_MainDiv from './main_div/Welcome_MainDiv';
import Profile_MainDiv from './main_div/Profile_MainDiv';
import Leaderboard_MainDiv from './main_div/Leaderboard_MainDiv';
// import Chat_MainDiv from './main_div/Chat_MainDiv';
import Arena_Chat_MainDiv from './main_div/Arena_Chat';
// import Settings_MainDiv from './main_div/Settings_MainDiv';
import { User } from '../interfaces/user.interface';

export enum main_div_mode_t {
  ERROR_PAGE = -1,
  HOME_PAGE = 0,
  CHAT = 2,
  GAME = 3,
  PROFILE = 4,
  SETTINGS = 5,
  LEADERBORAD = 8,
}

interface MainDivProps
{
  userID: number;
  user: User;
  mode: main_div_mode_t;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
}

const MainDivSelector: React.FC<MainDivProps> = ({userID, user, mode, mode_set}) => {
	var userID = user.userID;
  switch (mode){
    case main_div_mode_t.HOME_PAGE:
      return (<Welcome_MainDiv user={user}/>);
	case main_div_mode_t.CHAT:
		return (<Arena_Chat_MainDiv/>)
	case main_div_mode_t.PROFILE:
		return (<Profile_MainDiv userID={userID} mode_set={mode_set} />);
	case main_div_mode_t.LEADERBORAD:
      	return (<Leaderboard_MainDiv/>);
	// case main_div_mode_t.SETTINGS:
	// 	return (<Settings_MainDiv userID={userID} mode_set={mode_set} />);
    default:
      mode_set(main_div_mode_t.ERROR_PAGE);
      return (<Error_MainDiv />);
  }
};

export default MainDivSelector;
