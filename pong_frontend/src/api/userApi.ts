import { User } from "../interfaces/user.interface";
import { fetchAddress } from "../components/div/channel_div";

// var fetchAddress = 'http://localhost:3000/';
var fetchUserAddress = fetchAddress + 'user/';
const slash = '/';
const updatePasswordEndpoint = '/update/password';
const updateUsernameEndpoint = '/update/username/';

export const getUsers = async () => {
  	const response = await fetch(fetchAddress + 'users');
  	const json = (await response.json());
	return json;
};

export const updateUserStatus = async () => {
	
}

export const getUserByToken = async (token:string | undefined): Promise<User> => {
	  try {
		// Make API call and get the response
		const response = await fetch(fetchUserAddress + 'authToken/' + token, {
		  method: "GET",
		  headers: {
			"Content-Type": "application/json"
		  }
		});
	
		if (response.ok) {
		  const userObject: User = await response.json();
		  return userObject;
		} else {
		  throw new Error(response.statusText);
		}
	  } catch (error) {
		throw new Error('Error fetching user with token. Please try again!');
	  }
};

export const createUser = async () => {
	const response = await fetch(fetchAddress + 'users');
	console.log(response.text);

	const json = (await response.json());
	return json;
};

export const verifyTFAToken = async (secret: string | undefined, token: string | undefined): Promise<boolean> => {
	try {
		const response = await fetch(fetchUserAddress + 'verify-totp', {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body:	JSON.stringify({
				"secret" : secret,
				"token" : token
			})
		});

		if (response.ok) {
			const isValid: boolean = await response.json();
			return isValid;
		} else {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error('Error verifying code. Please try again!');
	}
};

export const enableTFA = async (userID: number | undefined, secret: string, intra: string | undefined, token: string | undefined): Promise<User> => {
	try {
		const response = await fetch(fetchUserAddress + userID + slash + userID + slash + secret + '/enable/2fa', {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body:	JSON.stringify({
				"intraUsername" : intra,
				"passwordHash" : token
			})
		});

		if (response.ok) {
			const userObject: User = await response.json();
			return userObject;
		} else {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error('Error enabling 2FA. Try again!');
	}
};

export const updatePasswordApi = async (userID: number | undefined, newPassword: string, intra:string | undefined, token:string | undefined): Promise<User> => {
	try {
	  // Make API call and get the response
	  const response = await fetch(fetchUserAddress + userID + slash + newPassword + updatePasswordEndpoint, {
		method: "PUT",
		headers: {
		  "Content-Type": "application/json"
		},
		body:  JSON.stringify({
			"intraUsername" : intra,
			"passwordHash" : token
		})
	  });
  
	  if (response.ok) {
		const userObject: User = await response.json();
		return userObject;
	  } else {
		throw new Error(response.statusText);
	  }
	} catch (error) {
	  throw new Error('Error updating password. Try again!');
	}
  };

  export const updateUsernameApi = async (userID: number | undefined, newUsername: string, intra:string | undefined, token:string | undefined): Promise<User> => {
	try {
	  // Make API call and get the response
	  const response = await fetch(fetchUserAddress + userID + "/" + userID  + updateUsernameEndpoint + newUsername, {
		method: "PUT",
		headers: {
		  "Content-Type": "application/json"
		},
		body:  JSON.stringify({
			"intraUsername" : intra,
			"passwordHash" : token
		})
	  });
  
	  if (response.ok) {
		const userObject: User = await response.json();
		return userObject;
	  } else {
		throw new Error(response.statusText);
	  }
	} catch (error) {
	  throw new Error('Error updating username. Try again!');
	}
  };

export const updateAvatarApi = async (userID: number | undefined, formData: FormData, intra:string | undefined, token:string | undefined): Promise<User> => {
	try {
	  const response = await fetch(fetchUserAddress + userID + '/update/avatar', {
		method: 'PUT',
        body: formData,
	  });
      console.log("Test")
	  if (response.ok) {
        console.log("Test3")
		const userObject: User = await response.json();
		return userObject;
	  } else {
		throw new Error(response.statusText);
	  }
	} catch (error) {
        console.log("Test2")
		throw new Error('Error uploading avatar. Try again!');
	}
  };