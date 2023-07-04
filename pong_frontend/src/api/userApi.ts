var fetchAddress = 'http://localhost:3000/';

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