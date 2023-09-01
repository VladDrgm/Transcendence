import { Channel, ChatData, ChatProps } from "../../interfaces/channel.interface";
import { fetchAddress } from "../../components/div/channel_div";

export async function getChannels():  Promise<Channel[]> {
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
export function deleteChannel(
  props: ChatProps,
  currentChat: ChatData,
  updateChannellist: () => void,
  toggleChat: (currentChat: ChatData) => void,
  generalChat: ChatData) {
  if (currentChat.Channel.ChannelId === 41)
  {
    console.error("Error: Don't delete general Channel");
    return;
  }
  fetch(fetchAddress + 'channel/' + currentChat.Channel.ChannelId, {method: 'DELETE'})
  .then(response => {
    if (response.ok) {
      console.log("Channel deleted successfully.");
      props.deleteChatRoom(currentChat.chatName);
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

//when using gives a internal server error for OwnerId = null, while i give some not null OwnerId
export function postChannel(ChannelData: any, callerID: number) {
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
  fetch(fetchAddress + 'channel/' + callerID, requestOptions)
    .then(response => response.json())
    .then(data => {console.log("Channel created:", data);})
    .catch(error => {console.log("Error creating channel:", error);});
}
