import React from 'react';
import {main_div_mode_t} from '../MainDivSelector'

interface ProfileProps
{
  userID: number;
  mode_set: React.Dispatch<React.SetStateAction<main_div_mode_t>>;
}

const Profile_MainDiv: React.FC<ProfileProps> = ({userID, mode_set}) => {
    return (<div>
                <p>Welcome {userID}. This is your profile. Your data is not ready yet but you can search for our friends here:</p>
                <button onClick={() => mode_set(main_div_mode_t.FRIIEND_PROFILE)}>Search friends</button>
            </div>)
};

export default Profile_MainDiv;
