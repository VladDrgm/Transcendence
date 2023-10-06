import { fetchAddress } from "../components/div/ChannelDiv";
import { User } from "../interfaces/User";

export function postUserStatus(status: string, user: User): Promise<boolean> {
	if (user) {
		user!.status = status;
	
		const ChannelData = {
		"intraUsername": user?.intraUsername,
		"passwordHash": user?.passwordHash
		}
		const jsonData = JSON.stringify(ChannelData);  
		const requestOptions = {
		method: 'PATCH',
		headers: { 
			"Accept": "*/*",
			"Content-Type": "application/json"
		},
		body: jsonData
		};
	
		return fetch(fetchAddress + 'user/' + user.userID +'/' + user.userID + '/' + status, requestOptions)
		.then(response => {
			if (!response.ok) {
			throw new Error('Request failed with status: ' + response.status);
			}
			return true;
		})
		.catch(error => {
			console.error("Error updating UserStatus of UserId :" + user.userID +":", error);
			return false;
		});
	} else {
		return new Promise((resolve, reject) => {
			const data = false;
			resolve(data);
		  });
	}
}