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

export const updateAvatarApi = async (userID: number, formData: FormData) => {
	try {
	  const response = await fetch(fetchAddress + userID + '/update/avatar', {
		method: 'PUT',
		body: formData,
	  });
  
	  if (response.ok) {
		const userObject = await response.json();
		return userObject;
	  } else {
		throw new Error(response.statusText);
	  }
	} catch (error) {
	  throw new Error('Error updating avatar. Try again!');
	}
  };