export const getFriendList = async (userID:number) => {
    const response = await fetch('http://localhost:3000/friend/' + userID + '/friends');
    const json = (await response.json());
    return json;
  };