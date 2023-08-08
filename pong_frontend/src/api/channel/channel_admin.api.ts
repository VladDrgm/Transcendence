import { fetchAddress } from "../../components/div/channel_div";

//to be tested
export async function getAdmins(channelId: number): Promise<any[]>{
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
    return fetch(fetchAddress + 'channel/' + userId +'/' + targetId + '/' + channelId, requestOptions)
      .then(response => response.json())
      .then(data => {console.log("Channel Admin with UserId :" + userId +" added:", data);})
      .catch(error => {console.log("Error adding ChannelAdmin with UserId :" + userId +":", error);});
  }
  