import { fetchAddress } from "../components/div/channel_div";
// var fetchAddress = 'http://localhost:3000/';

export const changeUsername = async (userID:number, username:string, intra:string, token:string) => {
	const requestOptions = {
		method: 'PUT',
		body:  JSON.stringify({
			"intraUsername" : intra,
			"passwordHash" : token
		})
	  };
  	const response = await fetch(fetchAddress + "user/" + userID + "/update/username/" + username, requestOptions);
};