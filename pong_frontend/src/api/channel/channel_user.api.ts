import { fetchAddress } from "../../components/div/channel_div";
import { IUser } from "../../interfaces/interface";


export async function getUsers():  Promise<IUser[]> {
	try { 
    const response = await fetch(fetchAddress + 'user', {credentials: "include",});
    const json = await response.json();
	  return json as any[];
  } catch (error) {
    console.error('Error fetching Users:, error');
    return [];
  }
}


//to be tested
export async function getChannelUsers(channelId: number):  Promise<any[]> {
	const response = await fetch(fetchAddress + 'channel/' + channelId + '/users', {credentials: "include",});
  const json = await response.json();
	return json as any[];
}

//to be tested
export async function getChannelUser(userId: number, channelId: number): Promise<any> {
  if (userId === undefined || channelId === undefined) {
    throw new Error("Invalid userId or channelId");
  }
  try {
    const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/user', {credentials: "include",});

    if (!response.ok) {
      console.log("User is not Member of Channel");
      return false;
    }
    if (!response.headers.has("content-length")) {
      return false;
    }
    const json = await response.json();
    if(!json) {
      return false;
    }
    return json;
  } catch (error) {
      console.log("Error returning ChannelUser "+ userId + " of Channel "+ channelId + ":", error);
      return false;
  } 
}


export function deleteChannelUser(userId: number, channelId: number) {
    fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/user', {method: 'DELETE'})
      .then(response => response.json())
      .then(data => {console.log("ChannelUser" + userId + " deleted:", data);})
      .catch(error => {console.log("Error deleting ChannelUser " + userId + ":" , error);})
}
  
  //to be tested
  // adds a user to the Channeluser table of a channel with channelId
export function postChannelUser(userId: number, channelId: number) {
    const requestOptions = {
      method: 'POST',
      headers: { 
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      body:  ''
    };
    fetch(fetchAddress + 'channel/' + userId +'/' + channelId + '/user', requestOptions)
      .then(response => response.json())
      .then(data => {console.log("ChannelUser with UserId :" + userId +" added:", data);})
      .catch(error => {console.log("Error adding ChannelUser with UserId :" + userId +":", error);});
}
  
  
  //Channel blocked Users
  // fetches all blocked users from Channel with ChannelId
export async function getChannelUsersBlocked(channelId: number):  Promise<any[]> {
      const response = await fetch(fetchAddress + 'channel/' + channelId + '/blockedUsers', {credentials: "include",});
    const json = await response.json();
      return json as any[];
}
  
  //to be tested
  // fetches a specific User with UserId from blcoked list of Channel with ChannelId
export async function getChannelUserBlocked(userId: number, channelId: number): Promise<any> {
    const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/blocked', {credentials: "include",});
    const json = await response.json();
    return json; 
}
  
  //works fine
export function deleteChannelUserBlocked(userId: number, channelId: number) {
    fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/blocked', {method: 'DELETE'})
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed with status: ' + response.status);
      }
      return response.text();
    })
    .then(data => {
      console.log("ChannelUser " + userId + " unblocked from Channel");
    })
    .catch(error => {
      console.log("Error allowing ChannelUser " + userId + ":", error);
    });
}
  
  //to be tested
export function postChannelUserBlocked(userId: number, channelId: number) {
    const requestOptions = {
      method: 'POST',
      headers: { 
        "Accept": "*/*",
        "Container-Type": "application/json"
      },
      body:  ''
    };
    fetch(fetchAddress + 'channel/' + userId +'/' + channelId + '/blocked', requestOptions)
      .then(response => response.json())
      .then(data => {console.log("ChannelUser with UserId :" + userId +" blocked:", data);})
      .catch(error => {console.log("Error blocking ChannelUser with UserId :" + userId +":", error);});
}

//to be tested#
// checks if userId is on the list of blocked Users in Channel with ChannelId
// returns the User json, if blocked and false if not or an error occured
export async function getChannelBlockedUser(userId: number, channelId: number): Promise<any> {
    if (userId === undefined || channelId === undefined) {
      throw new Error("Invalid userId or channelId");
    }
    try {
      const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/blocked', {credentials: "include",});
  
      if (!response.ok) {
        console.error("Error retrieving blocked ChannelUser");
        return false;
      }
      if (!response.headers.has("content-length")) {
        return false;
      }
      const json = await response.json();
      if(!json) {
        return false;
      }
      return json;
    } catch (error) {
        console.log("Error returning blocked ChannelUser "+ userId + " of Channel "+ channelId + ":", error);
        return false;
    } 
  }


  export function postMuteUser(callerId: number, targetId: number, channelId: number, duration: number) {
    const requestOptions = {
      method: 'POST',
      headers: { 
        "Accept": "*/*",
        "Container-Type": "application/json"
      },
      body:  ''
    };
    fetch(fetchAddress + 'channel/' + callerId +'/' + targetId + '/' + channelId + '/mute/' + duration, requestOptions)
      .then(response => response.json())
      .then(data => {console.log("ChannelUser with UserId :" + targetId +" muted:", data);})
      .catch(error => {console.log("Error muting ChannelUser with UserId :" + targetId +":", error);});
}