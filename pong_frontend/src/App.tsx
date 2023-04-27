import React, {useState} from 'react';
import LogIn from './components/LogIn';
import UserStartPage from './components/UserStartPage';

const App = () => {
  const [userID, userID_set] = useState<number>(0);
  const [loged_in, loged_in_set] = useState<boolean>(false);

 
  if (!loged_in)
  {
    return (
      <LogIn userID_set={userID_set} loginDone_set={loged_in_set}  />
    );
  }
  else
  {
    return (
      <UserStartPage id={userID} />
    );
  }
  
};

export default App;