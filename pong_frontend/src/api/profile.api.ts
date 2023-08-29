import { fetchAddress } from "../components/div/channel_div";

export async function getFriendProfile(userID:number, friendID:number)  {
	const response = await fetch(fetchAddress + 'friend/' + userID + '/friend/' + friendID);
    const json = (await response.json());
	return json;
  }

export async function getPrivateProfile(userID:number | undefined)  {
  const response = await fetch(fetchAddress + 'user/user/' + userID);
  const json = (await response.json());
return json;
}

export async function getPublicProfile(userID:number)  {
  const response = await fetch(fetchAddress + 'user/user/' + userID);
    const json = (await response.json());
  return json;
  }
