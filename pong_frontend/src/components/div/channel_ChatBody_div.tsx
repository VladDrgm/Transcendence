import React, { KeyboardEvent } from 'react';
import { ChatProps, Message } from '../../interfaces/channel.interface';
import { renderMessages } from './chat_utils';
import { TextBox, Messages } from '../main_div/Chat_MainDiv';

interface ChatBodyProps {
  props: ChatProps;
  isUserInChannelBlocked: boolean;
  isUserInChannel: boolean;
  isAdmin: boolean;
  isAdminResolved: boolean;
  loadingChatBody: boolean;
  messages: Message[];
}

const ChatBody_Div: React.FC<ChatBodyProps> = ({
  props,
  isUserInChannelBlocked,
  isUserInChannel,
  isAdmin,
  isAdminResolved,
  loadingChatBody,
  messages
}) => {
  if (isUserInChannelBlocked) {
    return ( 
      loadingChatBody ? (
      <div>Loading Chat...</div> // Show a loading spinner or placeholder
      ) : (
        <TextBox>
          You are blocked from using this Channel.
        </TextBox>
        // setLoadingChatBody(true);
      )
    );
  } else if(props.currentChat.Channel.Type === "private"){
    return (
      <TextBox>
          Private
        </TextBox>
  );
  }  else if ((isUserInChannel || !props.currentChat.isChannel) || (isAdmin && isAdminResolved) || props.connectedRooms.includes(props.currentChat.chatName.toString())) {
    return (
      loadingChatBody ? (
        <div>Loading Chat...</div> // Show a loading spinner or placeholder
        ) : (
        <Messages>
          {messages.map(renderMessages)}
        </Messages>)
      );
  }  else {
    return (
      loadingChatBody ? (
        <div>Loading Chat...</div> // Show a loading spinner or placeholder
        ) : (
        <button onClick={() => props.joinRoom(props.currentChat.chatName)}>
          Join {props.currentChat.chatName}
        </button>
        )
    );
  }
};

export default ChatBody_Div;
