export async function getFriendProfile(friendID:number)  {
	const response = await fetch('http://localhost:3000/profile/friend/' + friendID);
    const json = (await response.json());
	return json;
  }