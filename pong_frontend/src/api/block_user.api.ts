import { fetchAddress } from "../components/div/ChannelDiv";
import { User } from "../interfaces/User";

export async function postBlockedUser(targetId: number, user: User): Promise<boolean> {
    const ChannelData = {
      intraUsername: user?.intraUsername,
      passwordHash: user?.passwordHash
    };
  
    const jsonData = JSON.stringify(ChannelData);
  
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
      body: jsonData
    };
  
    try {
      const response = await fetch(fetchAddress + 'blocked/' + user.userID + '/' + targetId, requestOptions);
  
      if (response.ok) {
        return true;
      } else {
        console.error('Error blocking User with UserId :' + targetId + ':', response.status);
        alert('Error blocking User: ' + response.status);
        return false;
      }
    } catch (error) {
      console.error('Error blocking User with UserId :' + targetId + ':', error);
      alert('Error blocking User: ' + error);
      return false; 
    }
  }
  
  
  export async function deleteBlockedUser(targetId: number, user: User): Promise<void> {
    const ChannelData = {
      "intraUsername": user?.intraUsername,
      "passwordHash": user?.passwordHash
    }
    const jsonData = JSON.stringify(ChannelData);   
    const requestOptions = {
      method: 'DELETE',
      headers: { 
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      body: jsonData
    };
    fetch(fetchAddress + 'blocked/' + user.userID + '/' + targetId, requestOptions)
      .then(response => {
        if (response.ok) {
            return true; // Successful
        } else {
          console.error("Error unblocking User with UserId :" + targetId +":", response.status);
          alert('Error unblocking User: ' + response.status);
          return false;
        }
      })
      .catch(error => {
        console.error("Error unblocking User with UserId :" + targetId +":", error);
        alert('Error unblocking User: ' + error);
        return false; 
      });
  }
  
  export async function getBlockedUser(callerId: number  | undefined, targetId: number, user: User): Promise<boolean> {
    const ChannelData = {
      "intraUsername": user?.intraUsername,
      "passwordHash": user?.passwordHash
    }
    const jsonData = JSON.stringify(ChannelData);  
    const requestOptions = {
      method: 'PUT',
      headers: { 
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      body: jsonData
    };
    return fetch(fetchAddress + 'blocked/'+ callerId + "/" + targetId, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.hasOwnProperty('blockId')) {
          return true;
        } else if (data.message === "No such blocked user") {
          return false;
        } else {
            return false;
        }
      })
      .catch(error => {
        return false;
      }
      );
  }
  