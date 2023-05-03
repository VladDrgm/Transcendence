import React, {useRef, useState} from 'react';
import {main_div_mode_t} from '../MainDivSelector'
import Friend_Div from '../div/friend_div'

interface FriendProfileProps
{
  userID: number;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
}

const Friend_Profile_MainDiv: React.FC<FriendProfileProps> = ({userID, mode_set}) => {
  const input_id = useRef<HTMLInputElement>(null);
  const [friendsID, setFriendID] = useState<number>(-1);
  function saveFriend_id() : void {
    if (input_id.current != null)
    {
      const parsedInput = parseInt(input_id.current.value);
      if (!isNaN(parsedInput))
      {
        setFriendID(parsedInput);
      }
      input_id.current.value = '';
    }
  };
  return (<div>
            <div>
              <div>Friend search by id: </div>
              <input ref={input_id} type="text" />
              <button onClick={saveFriend_id}>Search</button>
            </div>
            <div>
            <Friend_Div  friendID={friendsID}/>
            </div>
          </div>);
};

export default Friend_Profile_MainDiv;
