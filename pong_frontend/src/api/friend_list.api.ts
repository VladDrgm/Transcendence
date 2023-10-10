// import { boolean } from "yup";
import { fetchAddress } from "../components/div/ChannelDiv";

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

export const checkFriend = async (userID:number | undefined, friendID:number, intra:string | undefined, token:string | undefined) => {
  
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
  var ret;
  const response = await fetch(fetchAddress + 'friend/' + userID + '/friend/' + friendID + '/check', requestOptions)
  .then(response => response.text())
  .then(data => {
    if (data === "Is a friend.") {
      ret = true;
    } else {
      ret = false;
    }
  })
  .catch(error => {
    console.error(error);
    ret = false;
  }
  );
  return ret;
};

export const addFriend = async (userID:number | undefined, friendID:number, intra:string | undefined, token:string | undefined) => {
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

export const removeFriend = async (userID:number | undefined, friendID:number, intra:string | undefined, token:string | undefined) => {
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