import { channel } from "diagnostics_channel";
import { Channel } from "../interfaces/channel.interface";

var fetchAddress = 'http://localhost:3000/';

export async function getChannels():  Promise<any[]> {
	const response = await fetch(fetchAddress + 'channel', {credentials: "include",});
  const json = await response.json();
	return json as any[];
}

//to be tested
export async function getChannel(channelId: number): Promise<Channel> {
  const response = await fetch(fetchAddress + 'channel/' + channelId, {credentials: "include",});
  const json = await response.json();
  return json as Channel; 
}

//to be tested
export function deleteChannel(channelId: number) {
  fetch(fetchAddress + 'channel/' + channelId, {method: 'DELETE'})
    .then(response => response.json())
    .then(data => {console.log("Channel deleted:", data);})
    .catch(error => {console.log("Error deleting Channel:", error);})
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
export function getAdmins(channelId: number){
  fetch(fetchAddress + 'channel/' + channelId + '/admin', {credentials: "include",})
    .then(response => response.json())
    .then(data => {
      console.log("Admins of channlId " + channelId + ":", data);
      return data;
    })
    .catch(error => {
      console.log("Error returning Admins of channelId " + channelId + ":", error);
      return [];
    });
}

//to be tested
export async function getIsAdmin(channelId: number, userId: number): Promise<any> {
  try {
    const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/admin', {credentials: "include",})
    const data = await response.json();
    console.log("User " + userId + " is Admin of channlId " + channelId + ":", data);
      return data;
  } catch (error) {
      console.log("Error returning Admins of channelId " + channelId + ":", error);
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
  const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/user', {credentials: "include",});
  const json = await response.json();
  return json; 
}

//to be tested
export function deleteChannelUser(userId: number, channelId: number) {
  fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/user', {method: 'DELETE'})
    .then(response => response.json())
    .then(data => {console.log("ChannelUser" + userId + " deleted:", data);})
    .catch(error => {console.log("Error deleting ChannelUser " + userId + ":" , error);})
}

//to be tested
export function postChannelUser(userId: number, channelId: number) {
  const requestOptions = {
    method: 'POST',
    headers: { 
      "Accept": "*/*",
      "Container-Type": "application/json"
    },
    body:  ''
  };
  fetch(fetchAddress + 'channel/' + userId +'/' + channelId + '/user', requestOptions)
    .then(response => response.json())
    .then(data => {console.log("ChannelUser with UserId :" + userId +" added:", data);})
    .catch(error => {console.log("Error adding ChannelUser with UserId :" + userId +":", error);});
}


//Channel blocked Users

export async function getChannelUsersBlocked(channelId: number):  Promise<any[]> {
	const response = await fetch(fetchAddress + 'channel/' + channelId + '/blockedUsers', {credentials: "include",});
  const json = await response.json();
	return json as any[];
}

//to be tested
export async function getChannelUserBlocked(userId: number, channelId: number): Promise<any> {
  const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/blocked', {credentials: "include",});
  const json = await response.json();
  return json; 
}

//to be tested
export function deleteChannelUserBlocked(userId: number, channelId: number) {
  fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/blocked', {method: 'DELETE'})
    .then(response => response.json())
    .then(data => {console.log("ChannelUser" + userId + " blocked:", data);})
    .catch(error => {console.log("Error blocking ChannelUser " + userId + ":" , error);})
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