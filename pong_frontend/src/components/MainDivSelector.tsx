import React from 'react';
import Error_MainDiv from './main_div/Error_MainDiv';
import Welcome_MainDiv from './main_div/Welcome_MainDiv';
import Profile_MainDiv from './main_div/Profile_MainDiv';
import Friend_Profile_MainDiv from './main_div/Friend_Profile_MainDiv';
// import Chat_MainDiv from './main_div/Chat_MainDiv';
import Arena_Chat_MainDiv from './main_div/Arena_Chat';


export enum main_div_mode_t {
  ERROR_PAGE = -1,
  WELCOME_PAGE = 0,
  PROFILE = 1,
  FRIENDS_LIST = 2, 
  MATCH_HISTORY = 3,
  SETTINGS = 4,
  CHAT = 5,
  GAME = 6,
  FRIIEND_PROFILE = 7
}

interface MainDivProps
{
  userID: number;
  mode: main_div_mode_t;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
}

const MainDivSelector: React.FC<MainDivProps> = ({userID, mode, mode_set}) => {
  switch (mode){
    case main_div_mode_t.WELCOME_PAGE:
      return (<Welcome_MainDiv userID={userID} />);
    case main_div_mode_t.PROFILE:
      return (<Profile_MainDiv userID={userID} mode_set={mode_set} />);
    case main_div_mode_t.FRIIEND_PROFILE:
      return (<Friend_Profile_MainDiv userID={userID} mode_set={mode_set} />);
    case main_div_mode_t.CHAT:
      return (<Arena_Chat_MainDiv/>)
    default:
      mode_set(main_div_mode_t.ERROR_PAGE);
      return (<Error_MainDiv />);
  }
};

export default MainDivSelector;
