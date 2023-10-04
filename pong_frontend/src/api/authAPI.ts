import { User } from "../interfaces/User";
var fetchAddress = `${process.env.REACT_APP_BASE_URL}`;
var signUpEndpoint = 'user';

export const userSignupAPI = async (newUser: User): Promise<User> => {
	try {
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
