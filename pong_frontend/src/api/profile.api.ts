import { fetchAddress } from "../components/div/ChannelDiv";

export async function getFriendProfile(userID:number | undefined, friendID:number, intra:string | undefined, token:string | undefined)  {
	const response = await fetch(fetchAddress + 'friend/' + userID + '/friend/' + friendID, {
		method: "PUT",
		headers: {
		  "Content-Type": "application/json"
		},
		body:  JSON.stringify({
			"intraUsername" : intra,
			"passwordHash" : token
		})
	  });
    const json = (await response.json());
	return json;
  }

export async function getPrivateProfile(userID:number | undefined, intra:string | undefined, token:string | undefined)  {
  const response = await fetch(fetchAddress + 'user/user/' + userID, {
		method: "GET",
		headers: {
		  "Content-Type": "application/json"
		}
	  });
  const json = (await response.json());
return json;
}

export async function getPublicProfile(userID:number)  {
  const response = await fetch(fetchAddress + 'user/user/' + userID, {
		method: "GET",
		headers: {
		  "Content-Type": "application/json"
		}
	  });
    const json = (await response.json());
  return json;
  }
