import { channel } from "diagnostics_channel";
import { Channel, User } from "../interfaces/channel.interface";
import {IUser} from '../interfaces/interface';

var fetchAddress = 'http://localhost:3000/';

export async function getChannels():  Promise<any[]> {
	const response = await fetch(fetchAddress + 'channel', {credentials: "include",});
  const json = await response.json();
	return json as any[];
}

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
export async function getChannel(channelId: number): Promise<Channel> {
  const response = await fetch(fetchAddress + 'channel/' + channelId, {credentials: "include",});
  const json = await response.json();
  return json as Channel; 
}

//to be tested
export function deleteChannel(channelId: number) {
  if (channelId === 41)
  {
    console.error("Error: Don't delete general Channel");
    return;
  }
  fetch(fetchAddress + 'channel/' + channelId, {method: 'DELETE'})
    .then(response => response.json())
    .then(data => {console.log("Channel deleted:", data);})
    .catch(error => {console.error("Error deleting Channel:", error);})
}

//when using gives a internal server error for OwnerId = null, while i give some not null OwnerId
export function postChannel(ChannelData: any) {
  console.log("ChannelData from post:", ChannelData);
  console.log("JSON from post:", JSON.stringify(ChannelData));
  const requestOptions = {
    method: 'POST',
    headers: { 
      "Accept": "*/*",
      "Container-Type": "application/json"
    },
    body:  JSON.stringify(ChannelData)
  };
  fetch(fetchAddress + 'channel', requestOptions)
    .then(response => response.json())
    .then(data => {console.log("Channel created:", data);})
    .catch(error => {console.log("Error creating channel:", error);});
}

//Channel Admins

//to be tested
export function getAdmins(channelId: number): Promise<any[]>{
  return fetch(fetchAddress + 'channel/' + channelId + '/admin', {credentials: "include",})
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error retrieving admins for channelId " + channelId + ": " + response.status);
    }
  })
    .then(data => {
      if (data && data.lenght > 0) {
        console.log("Admins of channlId " + channelId + ":", data);
        return data;
      } else {
        console.log("No Admins for channelId " + channelId);
        return [];
      }
    })
    .catch(error => {
      console.log("Error returning Admins of channelId " + channelId + ":", error);
      return [];
    });
}

//tested
export async function getIsAdmin(channelId: number, userId: number): Promise<boolean> {
  try {
    const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/admin', {credentials: "include",})
    if (!response.ok) {
      console.error("Error retrieving ChannelUser");
      return false;
    }
    if (!response.headers.has("content-length")) {
      return false;
    }
    const data = await response.json();
    if(!data) {
      return false;
    }
    return true
  } catch (error) {
      console.log("Error returning Admin of channelId " + channelId + ":", error);
      return false;
  }
}


export function deleteAdmin(channelId: number, userId: number) {
  fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/admin', {method: 'DELETE'})
    .then(response => response.json())
    .then(data => {console.log("Admin UserId: " + userId + " of channelId: " + channelId + "deleted:", data);})
    .catch(error => {console.log("Error deleting Admin:", error);})
}

export function postAdmin(channelId: number, targetId: number, userId: number) {
  const requestOptions = {
    method: 'POST',
    headers: { 
      "Accept": "*/*",
      "Container-Type": "application/json"
    },
    body:  ''
  };
  fetch(fetchAddress + 'channel/' + userId +'/' + targetId + '/' + channelId + '/admin', requestOptions)
    .then(response => response.json())
    .then(data => {console.log("Channel Admin with UserId :" + userId +" added:", data);})
    .catch(error => {console.log("Error adding ChannelAdmin with UserId :" + userId +":", error);});
}


//Channel User

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
      console.error("Error retrieving ChannelUser");
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

//to be tested
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