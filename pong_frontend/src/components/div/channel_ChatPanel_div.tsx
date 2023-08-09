import React, { KeyboardEvent } from 'react';
import { ChatProps, Message } from '../../interfaces/channel.interface';
import { Messages, TextBox, renderMessages } from './chat_utils';
import { popUpJoinPrivateChannel } from './channel_popups';

interface ChatPanelProps {
  props: ChatProps;
}

const ChatInput_Div: React.FC<ChatPanelProps> = ({
  props,
}) => {

    function handleKeyPress(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter") {
		props.sendMessage();
		}
	}

  //Checking if everything is resolved
  if (!props.ChannelUserRoles.isAdminResolved || 
      !props.ChannelUserRoles.isBlockedResolved || 
      !props.ChannelUserRoles.isMutedResolved ||
      !props.ChannelUserRoles.isOwnerResolved||
      !props.ChannelUserRoles.isUserResolved)
    return (
        <TextBox
        placeholder="Loading..."
        />);
  //Checking if USer is Blocked from USing/Joining Channel
  if (props.ChannelUserRoles.isBlocked || props.ChannelUserRoles.isMuted) {
    return (
        <TextBox/>);
  }
  // Switch for Private and Public Channels
  switch (props.currentChat.Channel.Type) {
    case "private":
      if (props.ChannelUserRoles.isUser ||
          props.ChannelUserRoles.isAdmin ||
          !props.currentChat.isChannel
        ) {
        return (
            <TextBox
            value={props.message}
            onChange={props.handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="You can write something here"
            />);
      } else {
        return (
            <TextBox
            placeholder="You need to join first to send Messages"
            />);
      }
    case "public":
      if (
        props.ChannelUserRoles.isUser ||
        props.ChannelUserRoles.isAdmin ||
        !props.currentChat.isChannel 
      ) {
        return (
            <TextBox
            value={props.message}
            onChange={props.handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="You can write somehting here"
            />
        );
      } else {
        return (
            <TextBox
            placeholder="You need to join first to send Messages"
            />
        );
      }
      default:
        return (
            <TextBox
            placeholder="Loading..."
            />);
    }
};

export default ChatInput_Div;

