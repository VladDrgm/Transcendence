import React, { FC, KeyboardEvent, useEffect, useState } from 'react';
import { ChatProps, Message } from '../../interfaces/channel.interface';
import { Messages, TextBox, renderMessages } from './chat_utils';
import { popUpJoinPrivateChannel } from './channel_popups';

export interface chatInputProps {
  props: ChatProps;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

const ChatInput_Div: FC<chatInputProps> = ({
  props,
  value, 
  onChange,
  onKeyPress
}) => {

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
  if(!props.currentChat.isChannel && !props.ChannelUserRoles.isBlocked){
    return (
      <TextBox
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="You can write something here"
      />);
  }
  else if (props.ChannelUserRoles.isBlocked) {
    return (
        <TextBox
        placeholder="You are blocked from using the Channel"
        />);
  }
  else if (props.ChannelUserRoles.isMuted) {
    return (
        <TextBox
        placeholder="You are muted here"
        />);
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
        props.ChannelUserRoles.isUser ||
        props.ChannelUserRoles.isAdmin ||
        !props.currentChat.isChannel
      ) {
        return (
            <TextBox
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
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

