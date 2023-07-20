import React, {useState} from 'react';
import LogIn from './components/LogIn';
import UserStartPage from './components/UserStartPage';
import { UserProvider } from './interfaces/user.interface';
import { User } from './interfaces/user.interface';
import Welcome_MainDiv from './components/main_div/Welcome_MainDiv';

const App = () => {
	const [user, setUser] = useState<User | null>(null);
  	const [userID, userID_set] = useState<number>(0);
  	const [loged_in, loged_in_set] = useState<boolean>(false);

	const handleSignUp = (newUser: User) => {
		setUser(newUser);
	}
 
//   if (!loged_in)
//   {
//     return (
//       <LogIn userID_set={userID_set} loginDone_set={loged_in_set}  />
//     );
//   }
//   else
//   {
//     return (
// 		<UserProvider>
// 			<UserStartPage />
//   		</UserProvider>
//     );
//   }
return (
	<div>
		{!user ? (
			<LogIn onSignUp={handleSignUp} userID_set={userID_set} loginDone_set={loged_in_set} />
		) : (
			// <Welcome_MainDiv user={user} />
			<UserStartPage id={userID} user={user} />
		)}
	</div>
)
  
};

export default App;