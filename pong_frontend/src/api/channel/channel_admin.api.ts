import { fetchAddress } from "../../components/div/ChannelDiv";
import { User } from "../../interfaces/User";
  
export async function getIsAdmin(channelId: number, userId: number | undefined): Promise<boolean> {
    try {
      const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/admin', {credentials: "include", method: 'PUT'})
      if (!response.ok) {
        return false;
      }
      if (!response.headers.has("content-length")) {
        return false;
      }
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        return false; 
      }
      const data = await response.json();
      if(!data) {
        return false;
      }
      return true
    } catch (error) {
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
      .then(data => {})
      .catch(error => {})
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
      .then(data => {})
      .catch(error => {
        throw error;
      });
  }
  