import React, {useState} from 'react';
import MainDivSelector, {main_div_mode_t} from './MainDivSelector';


interface StartPageProps
{
  id: number;
}

const UserStartPage: React.FC<StartPageProps> = ({id}) => {
  const [mode, mode_set] = useState<main_div_mode_t>(main_div_mode_t.WELCOME_PAGE);

  return (<div>
            <header>
              <button onClick={() => mode_set(main_div_mode_t.PROFILE)}>Profie</button>
              <button onClick={() => mode_set(main_div_mode_t.FRIIEND_PROFILE)}>Friends</button>
              <button>Blocked</button>
              <button>Random match</button>
              <button>Chat</button>
              <button>Match History</button>
              <button>Setting</button>
            </header>
            <div style={{ width: '100%', height: '500px', backgroundColor: 'lightgray' }}>
              <MainDivSelector userID={id} mode={mode} mode_set={mode_set} />
            </div>
            
          </div>);
};

export default UserStartPage;
