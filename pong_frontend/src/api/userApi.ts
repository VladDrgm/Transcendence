import { User } from "../interfaces/user.interface";

var fetchAddress = 'http://localhost:3000/';
var fetchUserAddress = 'http://localhost:3000/user';
const slash = '/';
const updatePasswordEndpoint = '/update/password';
const updateUsernameEndpoint = '/update/username/';

export const getUsers = async () => {
  	const response = await fetch(fetchAddress + 'users');
  	const json = (await response.json());
	return json;
};

export const createUser = async () => {
	const response = await fetch(fetchAddress + 'users');
	console.log(response.text);

	const json = (await response.json());
	return json;
};

export const updatePasswordApi = async (userID: number, newPassword: string): Promise<User> => {
	try {
	  // Make API call and get the response
	  const response = await fetch(fetchUserAddress + userID + slash + newPassword + updatePasswordEndpoint, {
		method: "PUT",
		headers: {
		  "Content-Type": "application/json"
		},
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

  export const updateUsernameApi = async (userID: number, newUsername: string): Promise<User> => {
	try {
	  // Make API call and get the response
	  const response = await fetch(fetchUserAddress + userID + updateUsernameEndpoint + newUsername, {
		method: "PUT",
		headers: {
		  "Content-Type": "application/json"
		},
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

export const updateAvatarApi = async (userID: number, formData: FormData) => {
	  const response = await fetch(fetchUserAddress + userID + '/update/avatar', {
		method: 'PUT',
		body: formData,
	  });
  
	  if (response.ok) {
		const userObject = await response.json();
		return userObject;
	  } else {
		throw new Error(response.statusText);
	  }
  };