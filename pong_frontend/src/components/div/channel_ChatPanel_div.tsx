import React, { FC, useEffect, useState } from 'react';
import { ChatProps } from '../../interfaces/channel.interface';
import { TextBox } from './chat_utils';

interface ChatPanelProps {
  props: ChatProps;
  // handleKeyPress: React.KeyboardEvent<HTMLTextAreaElement> => void;
}

const ChatInput_Div: FC<ChatPanelProps> = ({
  props,
}) => {
  const [localMessage, setLocalMessage] = useState('');

  useEffect(() => {
    setLocalMessage(props.message.trim());
  }, [props.message]);

    function handleKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter") {
		props.sendMessage();
    setLocalMessage('');
		}
	}

  // //Checking if everything is resolved
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
            value={localMessage}
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
            value={localMessage}
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

