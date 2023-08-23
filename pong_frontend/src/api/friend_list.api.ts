export const getFriendList = async (userID:number | undefined) => {
    const response = await fetch('http://localhost:3000/friend/' + userID + '/friends');
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

export const checkFriend = async (userID:number, friendID:number) => {
  const response = await fetch('http://localhost:3000/friend/' + userID + '/friend/' + friendID);
  if (response.ok)
  {
    return true;
  }
  else
  {
    return false;
  }
};

export const addFriend = async (userID:number, friendID:number) => {
  const response = await fetch('http://localhost:3000/friend/' + userID + '/friend/' + friendID, {method:'POST'});
};

export const removeFriend = async (userID:number, friendID:number) => {
  const response = await fetch('http://localhost:3000/friend/' + userID + '/friend/' + friendID, {method:'DELETE'});
};