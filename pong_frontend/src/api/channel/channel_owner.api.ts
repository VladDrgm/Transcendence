import { fetchAddress } from "../../components/div/channel_div";
import { User } from "../../interfaces/user.interface";


// export async function getIsOwner(channelId: number, userId: number): Promise<boolean> {
//     try {
//       const response = await fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/owner', {credentials: "include",})
//       if (!response.ok) {
//         console.error("Error retrieving ChannelOwner");
//         return false;
//       }
//       if (!response.headers.has("content-length")) {
//         return false;
//       }
//       const data = await response.json();
//       if(!data) {
//         return false;
//       }
//       return true
//     } catch (error) {
//         console.log("Error returning Owner of channelId " + channelId + ":", error);
//         return false;
//     }
// }

export async function getOwnerId(channelId: number): Promise<number | undefined> {
  try {
    const response = await fetch(fetchAddress + 'channel/' + channelId + '/owner', {credentials: "include",})
    if (!response.ok) {
      console.error("Error retrieving ChannelOwner");
      return undefined;
    }
    if (!response.headers.has("content-length")) {
      return undefined;
    }
    const data = await response.json();
    console.log("data.UserID:", data.UserId);

    if(!data || typeof data.UserId !== 'number') {
      return undefined;
    }
    console.log("data.UserID:", data.UserId);
    return data.UserId;
  } catch (error) {
      console.log("Error returning Owner of channelId " + channelId + ":", error);
      return undefined;
  }
}


export function deleteOwner(channelId: number) {
    fetch(fetchAddress + 'channel/' + channelId + '/owner', {method: 'DELETE'})
      .then(response => response.json())
      .then(data => {console.log("Owner of channelId: " + channelId + "deleted:", data);})
      .catch(error => {console.log("Error deleting Owner:", error);})
}

export function putOwner(channelId: number, targetId: number) {
    const requestOptions = {
      method: 'PUT',
      headers: { 
        "Accept": "*/*",
        "Container-Type": "application/json"
      },
      body:  ''
    };
    fetch(fetchAddress + 'channel/' + targetId +'/' + channelId + '/owner', requestOptions)
      .then(response => response.json())
      .then(data => {console.log("Channel Owner with UserId :" + targetId +" added:", data);})
      .catch(error => {console.log("Error adding Channel Owner with UserId :" + targetId +":", error);});
}

// export function postOwner(channelId: number, targetId: number, userId: number) {
//     const requestOptions = {
//       method: 'POST',
//       headers: { 
//         "Accept": "*/*",
//         "Container-Type": "application/json"
//       },
//       body:  ''
//     };
//     fetch(fetchAddress + 'channel/' + userId +'/' + targetId + '/' + channelId + '/owner', requestOptions)
//       .then(response => response.json())
//       .then(data => {console.log("Channel Owner with UserId :" + userId +" added:", data);})
//       .catch(error => {console.log("Error adding Channel Owner with UserId :" + userId +":", error);});
// }
