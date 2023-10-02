import { User } from "../interfaces/User";

// var newFetchAddress = process.env.REACT_APP_SRVR_URL ||  'http://localhost:3000/';
// var fetchAddress = 'http://localhost:3000/';
// var fetchAddress = 'https://transcendence-server.azurewebsites.net/';
var fetchAddress = `${process.env.REACT_APP_BASE_URL}`;
var signUpEndpoint = 'user';
var loginEndpoint1 = 'user/'; // Replace later with user/login
var endpointSlash = '/'
var loginEndpoint2 = '/login/confirm';

export const userSignupAPI = async (newUser: User): Promise<User> => {
	try {
		// MAKE API call and get the response
		const response = await fetch(fetchAddress + signUpEndpoint, {
			method:"POST",
			headers: {
				"Content-Type": "application/json"
			},
			body:JSON.stringify(newUser),
		});

		if (response.ok) {
			const newCreateduserObject: User = await response.json();
			return newCreateduserObject;
		} else {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error('Error logging in. Try again!');
	}
};

export const userLoginAPI = async (username: string, password: string): Promise<User> => {
	try {
		// MAKE API call and get the response
		const response = await fetch(fetchAddress + loginEndpoint1 + username + endpointSlash + password + loginEndpoint2, {
			method:"POST",
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
		throw new Error('Error logging in. Try again!');
	}
};

export const generateToken = async () => {
	try {
		const response = await fetch(fetchAddress + 'generate-totp', {
			method:"GET",
			headers: {
				"Content-Type": "application/json"
			},
		});

		if (response.ok) {
			// Store token in variabel and return it
		} else {
			throw new Error(response.statusText);
		}
		// MAKE API call 
	} catch (error) {
		throw new Error('Error generating token. Try again!');
	}
};

export const verifyToken = async () => {
	try {
		// MAKE API call 
		const response = await fetch(fetchAddress + 'verify-totp', {
			method:"POST",
			headers: {
				"Content-Type": "application/json"
			},
		});

		if (response.ok) {
			// Store token in variabel and return it
		} else {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error('Error verifying token. Try again!');
	}
};

export async function login(userID:number)  { //placeholder for real login
    // const response = await fetch(process.env.REACT_APP_BASE_URL + 'user/login/' + userID, {credentials: 'include',});
    // const response = await fetch('http://localhost:3000/user/login/' + userID, {credentials: 'include',});
    // const response = await fetch('https://transcendence-server.azurewebsites.net/user/login' + userID, {credentials: 'include',})
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}user/login/${userID}`, {credentials: 'include',})
    const setCookieHeader = await response.headers.get("Set-Cookie");
    if (setCookieHeader) {
      document.cookie = setCookieHeader;
    }
    console.log(response.text());
    console.log("Tried to log in as " + userID);
}