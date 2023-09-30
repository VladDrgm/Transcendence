import { json } from "stream/consumers";
import { fetchAddress } from "../components/div/channel_div";
import { User } from "../interfaces/user.interface";

export function postUserStatus(callerId: number | undefined, targetId: number, status: string, user: User): Promise<boolean> {
    const ChannelData = {
      "intraUsername": user?.intraUsername,
      "passwordHash": user?.passwordHash
    }
    const jsonData = JSON.stringify(ChannelData);  
    const requestOptions = {
      method: 'PATCH',
      headers: { 
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      body: jsonData
    };
  
    return fetch(fetchAddress + 'user/' + callerId +'/' + targetId + '/' + status, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed with status: ' + response.status);
        }
        return true;
      })
      .catch(error => {
        console.error("Error updating UserStatus of UserId :" + targetId +":", error);
        return false;
      });
  }