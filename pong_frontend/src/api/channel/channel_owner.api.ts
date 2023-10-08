import { fetchAddress } from "../../components/div/ChannelDiv";

export async function getOwnerId(channelId: number): Promise<number | undefined> {
  try {
    const response = await fetch(fetchAddress + 'channel/' + channelId + '/owner', {credentials: "include",})
    if (!response.ok) {
      return undefined;
    }
    if (!response.headers.has("content-length")) {
      return undefined;
    }
    const data = await response.json();

    if(!data || typeof data.UserId !== 'number') {
      return undefined;
    }
    return data.UserId;
  } catch (error) {
      return undefined;
  }
}

export function deleteOwner(channelId: number) {
    fetch(fetchAddress + 'channel/' + channelId + '/owner', {method: 'DELETE'})
      .then(response => response.json())
      .then(data => {})
      .catch(error => {})
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
      .then(data => {})
      .catch(error => {});
}
