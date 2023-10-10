import { fetchAddress } from "../../components/div/ChannelDiv";
import { User } from "../../interfaces/User";


export async function getUsers():  Promise<any> {
	try { 
    const response = await fetch(fetchAddress + 'user', {credentials: "include", method: 'GET'});
    const json = await response.json();
	  return json as any[];
  } catch (error) {
    return [];
  }
}

export async function getChannelUser(callerId: number | undefined, channelId: number, targetId: number | undefined, user: User): Promise<any> {
  if (callerId === undefined || channelId === undefined || targetId === undefined) {
    throw new Error("Invalid userId or channelId");
  }
  try {
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
    const response = await fetch(fetchAddress + 'channel/' + callerId + '/' + targetId + '/' + channelId + '/user', requestOptions);

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
    const json = await response.json();
    if(!json) {
      return false;
    }
    return json;
  }catch (error) {
      return false;
  } 
}


export async function deleteChannelUser(userId: number | undefined, targetId: number | undefined, channelId: number, user: User): Promise<void>  {
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
  fetch(fetchAddress + 'channel/' + userId + '/' + targetId + '/' + channelId + '/user', requestOptions)
  .then(response => {
    if (response.ok) {
    } else {
      alert("Error while leaving Channel");
    }
  })
  .catch(error => {
    throw error;
  });
}
  
export async function postChannelUser(userId: number | undefined, channelId: number, user: User): Promise<void> {
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
    fetch(fetchAddress + 'channel/' + userId +'/' + channelId, requestOptions)
      .then(response => {
        if (response.ok) {
        } else {
          throw new Error ("Error adding ChannelUser");
        }
      })
      .catch(error => {
        throw error;
      });
}

export function postPrivateChannelUser(userId: number | undefined, channelId: number, password: string, user: User) {
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
  return fetch(fetchAddress + 'channel/' + userId +'/' + userId + '/' + channelId + '/' + password +  '/password', requestOptions)
  .then(response => {
    if (response.ok) {
    } else {
      throw new Error("Error adding ChannelUser");
    }
  })
  .catch(error => {
    throw error;
  });
}
  
  
export async function getChannelUsersBlocked(channelId: number):  Promise<any[]> {
      const response = await fetch(fetchAddress + 'channel/' + channelId + '/blockedUsers', {credentials: "include", method: 'PUT'});
    const json = await response.json();
      return json as any[];
}
  
export async function getChannelUserBlocked(callerId: number, targetId: number, channelId: number, user : User): Promise<any> {
  const ChannelData = {
    "intraUsername": user?.intraUsername,
    "passwordHash": user?.passwordHash
  }
  const jsonData = JSON.stringify(ChannelData);  
  const requestOptions = {
      method: 'PUT',
      headers: { 
        "Accept": "*/*",
        "Container-Type": "application/json"
      },
      body: jsonData
    };    
  const response = await fetch(fetchAddress + 'channel/' + callerId + '/' + targetId + '/' + channelId + '/blocked', requestOptions);
  const json = await response.json();
  return json; 
}
  
export function deleteChannelUserBlocked(callerId: number | undefined, targetId: number, channelId: number, user: User) {
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
  return fetch(fetchAddress + 'channel/' + callerId + '/' + targetId + '/' + channelId + '/blocked', requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed with status: ' + response.status);
      }
      return response.text();
    })
    .then(data => {
      alert("User is unbanned");
    })
    .catch(error => {
      alert("Error unbanning User");
    });
}
  
export function postChannelUserBlocked(callerId: number | undefined, targetId: number, channelId: number, user: User): Promise<boolean> {
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

  return fetch(fetchAddress + 'channel/ban/blocked/' + callerId +'/' + targetId + '/' + channelId + '/blocked', requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed with status: ' + response.status);
      }
      return true;
    })
    .catch(error => {
      return false;
    });
}

export async function getChannelBlockedUser(userId: number | undefined, channelId: number, user: User): Promise<any> {
  if (user === undefined) {
    throw new Error("Invalid userId");
  }  
  if (channelId === undefined) {
      throw new Error("Invalid userId or channelId");
    }
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
    return fetch(fetchAddress + 'channel/' + userId + '/' + userId + '/' + channelId + '/blocked', requestOptions)
    .then(response => {
      if (!response.ok) {
        return false;
      }
      return response.json().then(data => {
        return data;
      });
    })
    .catch (error => {
        return false;
    })
}

export function postMuteUser(callerId: number | undefined, targetId: number, channelId: number, duration: number, user: User): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
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

    fetch(fetchAddress + 'channel/' + callerId +'/' + targetId + '/' + channelId + '/mute/' + duration, requestOptions)
      .then(response => {
        if (!response.ok) {
          resolve(false);
        }
        else{
          alert("User is muted");
          resolve(true);
        }
      })
      .catch(error => {
        resolve(false);
      });  
  });  
}
interface ApiResponseItem {
  CUserId: number;
  UserId: number;
  ChannelId: number;
  MutedUntil: string;
}

function hasUserId(array: ApiResponseItem[], targetUserId: number | undefined): boolean {
  return (array.some(item => item.UserId === targetUserId));
}

export async function getMutedStatus(channelId: number, targetId: number | undefined): Promise<boolean> {
  try {
    const response = await fetch(fetchAddress + 'channel/' + channelId + '/mutedusers', {credentials: "include", method: 'PUT'})
    if (!response.ok) {
      if (response.status === 400){
        return false;
      }
      throw new Error("Error retrieving mute status");
    }
    if (!response.headers.has("content-length")) {
      return false;
    }
    const data = await response.json();
    if(!data) {
      return false;
    }
    const result = hasUserId(data, targetId);
    return result;
  } catch (error) {
      return false;
  }
}


export async function getIsMuted(channelId: number, callerId: number, targetId: number): Promise<boolean> {
  try {
    const response = await fetch(fetchAddress + 'channel/' + callerId + '/' + targetId + '/' + channelId + '/mute', {credentials: "include", method: 'PUT'})
    if (!response.ok) {
      if (response.status === 400){
        return false;
      }
      throw new Error("Error retrieving mute status");
    }
    if (!response.headers.has("content-length")) {
      return false;
    }
    const data = response.json();
    if(!data) {
      return false;
    }
    return true
  } catch (error) {
      return false;
  }
}

export function deleteChannelPassword(userId: number| undefined, channelId: number, user: User) {
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
  return fetch(fetchAddress + 'channel/' + userId + '/' + channelId + '/password', requestOptions)
  .then(response => {
    if (response.ok) {
    } else {
    }
  })
  .catch(error => {
  });
}

export function putChannelPassword(userId: number | undefined, channelId: number, password: string, user: User) {
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
  return fetch(fetchAddress + 'channel/' + userId +'/' + channelId + '/' + password +  '/password', requestOptions)
  .then(response => {
    if (response.ok) {
    } else {
    }
  })
  .catch(error => {
  });
}

export function putChannelType(userId: number | undefined, channelId: number, user: User) {
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
  return fetch(fetchAddress + 'channel/' + userId +'/' + channelId + '/type', requestOptions)
  .then(response => {
    if (response.ok) {
    } else {
    }
  })
  .catch(error => {
  });
}

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
      alert('User has been blocked.');
      return true;
    } else {
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
        alert("User has been unblocked.");
      } else {
        alert("Error unblocking User.");
      }
    })
    .catch(error => {
      throw error;
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
return fetch(fetchAddress + 'blocked/check/' + callerId + '/' + targetId, requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    if (data.includes('User is blocked')) {
      return true;
    } else if (data.includes('User not blocked')) {
      return false;
    } else {
      throw new Error('Error blocking User');
    }
  })
  .catch(error => {
    throw error;
  });
}

export function postFriend(targetId: number, userId: number | undefined, user: User) {
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
    body:  jsonData
  };
  return fetch(fetchAddress + 'friend/' + userId +'/friend/' + targetId , requestOptions)
    .then((response) =>{
      if (response.ok){
        return response.json();
      } else {
        throw new Error("Failed to add Friend");
      }
    })
    .then(data => {
    })
    .catch(error => {
      throw error;
    });
}

export function deleteFriend(targetId: number, userId: number | undefined, user: User) {
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
  return fetch(fetchAddress + 'friend/' + userId +'/friend/' + targetId , requestOptions)
    .then((response) =>{
      if (response.ok){
        return response.json();
      } else {
        throw new Error("Failed to remove Friend");
      }
    })
    .then(data => {
    })
    .catch(error => {
      throw error;
    });
}

export async function getIsFriend(callerId: number | undefined, targetId: number | undefined, user: User): Promise<boolean> {
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
  return fetch(fetchAddress + 'friend/'+ callerId + "/friend/" + targetId, requestOptions)
    .then(response => {
      if (response.ok)
        return true;
      else
        return false;
    })
    .catch(error => {
      throw error;
    });
}
