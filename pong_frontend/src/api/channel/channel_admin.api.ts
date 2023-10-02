import { fetchAddress } from "../../components/div/ChannelDiv";
import { User } from "../../interfaces/User";

//to be tested
export async function getAdmins(channelId: number): Promise<any[]>{
    return fetch(fetchAddress + 'channel/' + channelId + '/admin', {credentials: "include", method: 'PUT'})
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
  export async function getIsAdmin(channelId: number, userId: number | undefined): Promise<boolean> {
    try {
      const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/admin', {credentials: "include", method: 'PUT'})
      if (!response.ok) {
        console.error("Error retrieving ChannelUser");
        return false;
      }
      if (!response.headers.has("content-length")) {
        return false;
      }
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        return false; // No JSON data in the response
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
  
  
  export function deleteAdmin(channelId: number, user: User, targetId: number) {
    const ChannelData = {
      "intraUsername": user?.intraUsername,
      "passwordHash": user?.passwordHash
    }
    const jsonData = JSON.stringify(ChannelData);
    const requestOptions = {
      method: 'DELETE',
      headers: { 
        "Accept": "*/*",
        "Container-Type": "application/json"
      },
      body: jsonData
    };
    return fetch(fetchAddress + 'channel/' + user.userID + '/' + targetId + '/' + channelId + '/admin', requestOptions)
      .then(response => response.json())
      .then(data => {console.log("Admin UserId: " + targetId + " of channelId: " + channelId + "deleted:", data);})
      .catch(error => {console.log("Error deleting Admin:", error);})
  }
  
  export function postAdmin(channelId: number, targetId: number, user: User | null) {
    const ChannelData = {
      "intraUsername": user?.intraUsername,
      "passwordHash": user?.passwordHash
    }
    const jsonData = JSON.stringify(ChannelData);
    const requestOptions = {
      method: 'POST',
      headers: { 
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      body: jsonData
    };
    return fetch(fetchAddress + 'channel/admin/add/' + user?.userID +'/' + targetId + '/' + channelId, requestOptions)
      .then((response) =>{
        if (response.ok){
          return response.json();
        } else {
          throw new Error("Failed to add channel admin");
        }
      })
      .then(data => {console.log("Channel Admin with UserId :" + user?.userID +" added:", data);})
      .catch(error => {
        console.error("Error adding ChannelAdmin with UserId :" + user?.userID+":", error);
        throw error;
      });
  }
  