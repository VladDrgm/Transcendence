import React, { FC, KeyboardEvent, useEffect, useState } from 'react';
import { ChannelUserRoles, ChatData, ChatProps, Message } from '../../interfaces/channel.interface';
import { renderMessages } from './chat_utils';
import { popUpJoinPrivateChannel } from './channel_popups';
import { TextBox } from '../mainPages/ChatPageStyles';

export interface chatInputProps {
  props: ChatProps;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  ChannelUserRoles: ChannelUserRoles;
  currentChat: ChatData
}

const ChatInput_Div: FC<chatInputProps> = ({
  props,
  value, 
  onChange,
  onKeyPress,
  ChannelUserRoles,
  currentChat
}) => {

  // //Checking if everything is resolved
  if (!ChannelUserRoles.isAdminResolved ||
      !ChannelUserRoles.isBlockedResolved ||
      !ChannelUserRoles.isMutedResolved ||
      !ChannelUserRoles.isOwnerResolved||
      !ChannelUserRoles.isUserResolved)
    return (
        <TextBox
        placeholder="Loading..."
        />);
  //Checking if USer is Blocked from USing/Joining Channel
  if(!currentChat.isChannel && !ChannelUserRoles.isBlocked){
    return (
      <TextBox
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="You can write something here"
      />);
  }
  else if (ChannelUserRoles.isBlocked) {
    return (
        <TextBox
        placeholder="You are blocked from using the Channel"
        />);
  }
  else if (ChannelUserRoles.isMuted) {
    return (
        <TextBox
        placeholder="You are muted here"
        />);
  }
  // Switch for Private and Public Channels
  switch (currentChat.Channel.Type) {
    case "private":
      if (ChannelUserRoles.isUser ||
          ChannelUserRoles.isAdmin ||
          !currentChat.isChannel
        ) {
        return (
            <TextBox
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
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
        ChannelUserRoles.isUser ||
        ChannelUserRoles.isAdmin ||
        !currentChat.isChannel
      ) {
        return (
            <TextBox
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            placeholder="You can write something here"
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

