import React, { FC, KeyboardEvent } from 'react';
import { ChannelUserRoles, ChatData, ChatProps } from '../../interfaces/Channel';
import { TextBox } from '../mainPages/ChatPageStyles';

export interface chatInputProps {
  props: ChatProps;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  currentRoles: ChannelUserRoles;
  currentChat: ChatData
}

const ChannelInputDiv: FC<chatInputProps> = ({
  props,
  value, 
  onChange,
  onKeyPress,
  currentRoles,
  currentChat
}) => {

  if (!currentRoles.isAdminResolved ||
      !currentRoles.isBlockedResolved ||
      !currentRoles.isMutedResolved ||
      !currentRoles.isOwnerResolved||
      !currentRoles.isUserResolved)
    return (
        <TextBox
        placeholder="Loading..."
        />);
  if(!currentChat.isChannel && !currentRoles.isBlocked){
    return (
      <TextBox
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="You can write something here"
      />);
  }
  else if (currentRoles.isBlocked) {
    return (
        <TextBox
        placeholder="You are blocked from using the Channel"
        />);
  }
  else if (currentRoles.isMuted) {
    return (
        <TextBox
        placeholder="You are muted here"
        />);
  }
  switch (currentChat.Channel.Type) {
    case "private":
      if (currentRoles.isUser ||
        currentRoles.isAdmin ||
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
        currentRoles.isUser ||
        currentRoles.isAdmin ||
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

export default ChannelInputDiv;
