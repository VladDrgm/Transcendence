import { Channel, ChatData, ChatName, ChatProps } from "../../interfaces/Channel";
import { fetchAddress } from "../../components/div/ChannelDiv";

export async function getChannels():  Promise<Channel[]> {
	const response = await fetch(fetchAddress + 'channel', {credentials: "include", method: 'PUT'});
  const json = await response.json();
	return json as any[];
}


//to be tested
export async function getChannel(channelId: number): Promise<Channel> {
  const response = await fetch(fetchAddress + 'channel/' + channelId, {credentials: "include",method: 'PUT'});
  const json = await response.json();
  return json as Channel; 
}

//to be tested
export function deleteChannel(
  props: ChatProps,
  currentChat: ChatData,
  updateChannellist: () => void,
  toggleChat: (currentChat: ChatData) => void,
  generalChat: ChatData,
  deleteChatRoom: (chatName: ChatName) => void
  ) {
  if (currentChat.Channel.ChannelId === 41)
  {
    console.error("Error: Don't delete general Channel");
    return;
  }
  const ChannelData = {
    "intraUsername": props.user?.intraUsername,
    "passwordHash": props.user?.passwordHash
  }
  const jsonData = JSON.stringify(ChannelData);
  return fetch(fetchAddress + 'channel/' + props.user?.userID + '/' + currentChat.Channel.ChannelId, {credentials: "include",
      method:"DELETE",
      headers: {
          "Content-Type": "application/json"
        },
      body:jsonData
  })
  .then(response => {
    if (response.ok) {
      console.log("Channel deleted successfully.");
      deleteChatRoom(currentChat.chatName);
      updateChannellist();
      toggleChat(generalChat);
    } else {
      console.error("Error deleting Channel:", response.status);
    }
  })
  .catch(error => {
    console.error("Error deleting Channel:", error);
  });
}
