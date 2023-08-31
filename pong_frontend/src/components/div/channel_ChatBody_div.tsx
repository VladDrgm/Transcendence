import React, { KeyboardEvent } from 'react';
import { ChannelUserRoles, ChatName, ChatProps, Message } from '../../interfaces/channel.interface';
import {renderMessages } from './chat_utils';
import { popUpJoinPrivateChannel } from './channel_popups';
import { Messages } from '../mainPages/ChatPageStyles';

interface ChatBodyProps {
  props: ChatProps;
  // loadingChatBody: boolean;
  messages: Message[];
  ChannelUserRoles: ChannelUserRoles;
  joinRoom: (chatName: ChatName) => void;
}

const ChatBody_Div: React.FC<ChatBodyProps> = ({
  props,
  messages,
  ChannelUserRoles,
  joinRoom
}) => {
  if (!props.currentChat.isChannel){
    return (
      <Messages>{messages.map(renderMessages)}</Messages>);
  }
  //Checking if everything is resolved
  if (!ChannelUserRoles.isAdminResolved || 
      !ChannelUserRoles.isBlockedResolved || 
      !ChannelUserRoles.isMutedResolved ||
      !ChannelUserRoles.isOwnerResolved||
      !ChannelUserRoles.isUserResolved)
    return (
      <div>Loading Chat...</div>);
  //Checking if USer is Blocked from USing/Joining Channel
  if (ChannelUserRoles.isBlocked && ChannelUserRoles.isBlockedResolved) {
    return (
      <div>You are blocked from using this Channel.</div>);
  }
  // Switch for Private and Public Channels
  switch (props.currentChat.Channel.Type) {
    case "private":
      if (ChannelUserRoles.isUser ||
          ChannelUserRoles.isAdmin ||
          !props.currentChat.isChannel
        ) {
        return (
          <Messages>{messages.map(renderMessages)}</Messages>);
      } else {
        return (
          <button onClick={() => popUpJoinPrivateChannel(props)}>
            Join private Channel {props.currentChat.chatName}
          </button>);
      }
    case "public":
      if (
        ChannelUserRoles.isUser ||
        ChannelUserRoles.isAdmin ||
        !props.currentChat.isChannel 
      ) {
        return (
          <Messages>{messages.map(renderMessages)}</Messages>
        );
      } else {
        return (
          <button onClick={() => joinRoom(props.currentChat.chatName)}>
            Join {props.currentChat.chatName}
          </button>
        );
      }
      default:
        return (
         <div>Loading Chat 2...</div>);
    }
};

export default ChatBody_Div;

