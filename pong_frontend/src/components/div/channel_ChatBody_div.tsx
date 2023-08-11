import React, { KeyboardEvent } from 'react';
import { ChatProps, Message } from '../../interfaces/channel.interface';
import { Messages, TextBox, renderMessages } from './chat_utils';
import { popUpJoinPrivateChannel } from './channel_popups';

interface ChatBodyProps {
  props: ChatProps;
  // loadingChatBody: boolean;
  messages: Message[];
}

const ChatBody_Div: React.FC<ChatBodyProps> = ({
  props,
  messages
}) => {
  if (!props.currentChat.isChannel){
    return (
      <Messages>{messages.map(renderMessages)}</Messages>);
  }
  //Checking if everything is resolved
  if (!props.ChannelUserRoles.isAdminResolved || 
      !props.ChannelUserRoles.isBlockedResolved || 
      !props.ChannelUserRoles.isMutedResolved ||
      !props.ChannelUserRoles.isOwnerResolved||
      !props.ChannelUserRoles.isUserResolved)
    return (
      <div>Loading Chat...</div>);
  //Checking if USer is Blocked from USing/Joining Channel
  if (props.ChannelUserRoles.isBlocked && props.ChannelUserRoles.isBlockedResolved) {
    return (
      <div>You are blocked from using this Channel.</div>);
  }
  // Switch for Private and Public Channels
  switch (props.currentChat.Channel.Type) {
    case "private":
      if (props.ChannelUserRoles.isUser ||
          props.ChannelUserRoles.isAdmin ||
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
        props.ChannelUserRoles.isUser ||
        props.ChannelUserRoles.isAdmin ||
        !props.currentChat.isChannel 
      ) {
        return (
          <Messages>{messages.map(renderMessages)}</Messages>
        );
      } else {
        return (
          <button onClick={() => props.joinRoom(props.currentChat.chatName)}>
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

