import React from 'react';

interface StartPageProps
{
  id: number;
}

const UserStartPage: React.FC<StartPageProps> = ({id}) => {
  return (<div>
            <header>
              <button>Profie</button>
              <button>Friends</button>
              <button>Blocked</button>
              <button>Random match</button>
              <button>Chat</button>
              <button>Match History</button>
              <button>Setting</button>
            </header>
            <div style={{ width: '100%', height: '500px', backgroundColor: 'lightgray' }}>
              <p>This is user {id}</p>
            </div>
            
          </div>);
};

export default UserStartPage;
