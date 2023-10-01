import React, { KeyboardEvent } from 'react';
import { ChannelUserRoles, ChatData, ChatName, ChatProps, Message } from '../../interfaces/channel.interface';
import {renderMessages } from './chat_utils';
import { popUpJoinPrivateChannel } from './channel_popups';
import { Messages, chatButtonsStyle } from '../mainPages/ChatPageStyles';

interface ChatBodyProps {
  props: ChatProps;
  // loadingChatBody: boolean;
  messages: Message[];
  ChannelUserRoles: ChannelUserRoles;
  joinRoom: (chatName: ChatName) => void;
	joinPrivateRoom: (chatName: ChatName, password: string) => void;
  currentChat: ChatData;
}

const ChatBodyDiv: React.FC<ChatBodyProps> = ({
  props,
  messages,
  ChannelUserRoles,
  joinRoom,
  currentChat,
  joinPrivateRoom
}) => {
  if (!currentChat.isChannel){
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
  switch (currentChat.Channel.Type) {
    case "private":
      if (ChannelUserRoles.isUser ||
          ChannelUserRoles.isAdmin ||
          !currentChat.isChannel
        ) {
        return (
          <Messages>{messages?.map(renderMessages)}</Messages>);
      } else {
        return (
          <button 
          style={chatButtonsStyle}
          onClick={() => popUpJoinPrivateChannel(props, currentChat, joinPrivateRoom)}>
            Join private Channel {currentChat.chatName}
          </button>);
      }
    case "public":
      if (
        ChannelUserRoles.isUser ||
        ChannelUserRoles.isAdmin ||
        !currentChat.isChannel 
      ) {
        return (
          <Messages>{messages?.map(renderMessages)}</Messages>
        );
      } else {
        return (
          <button 
          style={chatButtonsStyle}
          onClick={() => joinRoom(currentChat.chatName)}>
            Join {currentChat.chatName}
          </button>
        );
      }
      default:
        return (
         <div>Loading Chat 2...</div>);
    }
};

export default ChatBodyDiv;

