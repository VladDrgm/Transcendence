import { fetchAddress } from "../components/div/channel_div";

export const getFriendList = async (userID:number | undefined, intra:string | undefined, token:string | undefined) => {
  const requestOptions = {
		method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
		body:  JSON.stringify({
			"intraUsername" : intra,
			"passwordHash" : token
		})
	  };
  const response = await fetch(fetchAddress + 'friend/' + userID + '/friends', requestOptions);
    if (response.ok)
    {
      const json = (await response.json());
      return json;
    }
    else
    {
      return([]);
    }
  };

export const checkFriend = async (userID:number, friendID:number, intra:string | undefined, token:string | undefined) => {
  
  const requestOptions = {
		method: 'PUT',
    headers: {
		  "Content-Type": "application/json"
		},
		body:  JSON.stringify({
			"intraUsername" : intra,
			"passwordHash" : token
		})
	  };
  const response = await fetch(fetchAddress + 'friend/' + userID + '/friend/' + friendID, requestOptions);
  if (response.ok)
  {
    return true;
  }
  else
  {
    return false;
  }
};

export const addFriend = async (userID:number, friendID:number, intra:string | undefined, token:string | undefined) => {
  const requestOptions = {
		method: 'POST',
    headers: {
		  "Content-Type": "application/json"
		},
		body:  JSON.stringify({
			"intraUsername" : intra,
			"passwordHash" : token
		})
	  };
  const response = await fetch(fetchAddress + 'friend/' + userID + '/friend/' + friendID, requestOptions);
};

export const removeFriend = async (userID:number, friendID:number, intra:string | undefined, token:string | undefined) => {
  const requestOptions = {
		method: 'DELETE',
    headers: {
		  "Content-Type": "application/json"
		},
		body:  JSON.stringify({
			"intraUsername" : intra,
			"passwordHash" : token
		})
	  };
  const response = await fetch(fetchAddress + 'friend/' + userID + '/friend/' + friendID, requestOptions);
};