import React, {useMemo} from 'react';
import { ChannelUserRoles, ChatData, ChatName, ChatProps, Message } from '../../interfaces/Channel';
import {renderMessages } from './ChatUtils';
import { popUpJoinPrivateChannel } from './ChannelPopups';
import { Messages, chatButtonsStyle } from '../mainPages/ChatPageStyles';

interface ChatBodyProps {
  props: ChatProps;
  messages: Message[];
  ChannelUserRoles: ChannelUserRoles;
  joinRoom: (chatName: ChatName) => void;
	joinPrivateRoom: (chatName: ChatName, password: string) => void;
  currentChat: ChatData;
  excludedSenders: string[];
}


const ChatBodyDiv: React.FC<ChatBodyProps> = ({
  props,
  messages = [],
  ChannelUserRoles,
  joinRoom,
  currentChat,
  joinPrivateRoom,
  excludedSenders,
}) => {
  const content = useMemo(() => {
    if (!currentChat.isChannel || currentChat.chatName === "general") {
      return (
        <Messages>
          {messages.map((message, index) => (
            <div key={index}>
              {renderMessages(message, index, excludedSenders)}
            </div>
          ))}
        </Messages>
      );
    } else if (
      !ChannelUserRoles.isAdminResolved ||
      !ChannelUserRoles.isBlockedResolved ||
      !ChannelUserRoles.isMutedResolved ||
      !ChannelUserRoles.isOwnerResolved ||
      !ChannelUserRoles.isUserResolved
    ) {
      return <div>Loading Chat...</div>;
    } else if (ChannelUserRoles.isBlocked && ChannelUserRoles.isBlockedResolved) {
      return <div>You are blocked from using this Channel.</div>;
    } else {
      switch (currentChat.Channel.Type) {
        case 'private':
          if (
            ChannelUserRoles.isUser ||
            (ChannelUserRoles.isAdmin && ChannelUserRoles.isUser) ||
            ChannelUserRoles.isOwner ||
            !currentChat.isChannel
          ) {
            return (
              <Messages>
                {messages.map((message, index) => (
                  <div key={index}>
                    {renderMessages(message, index, excludedSenders)}
                  </div>
                ))}
              </Messages>
            );
          } else {
            return (
              <button
                style={chatButtonsStyle}
                onClick={() =>
                  popUpJoinPrivateChannel(props, currentChat, joinPrivateRoom)
                }
              >
                Join private Channel {currentChat.chatName}
              </button>
            );
          }
          break;
        case 'public':
          if (
            ChannelUserRoles.isUser ||
            (ChannelUserRoles.isAdmin && ChannelUserRoles.isUser) ||
            ChannelUserRoles.isOwner ||
            !currentChat.isChannel
          ) {
            return (
              <Messages>
                {messages.map((message, index) => (
                  <div key={index}>
                    {renderMessages(message, index, excludedSenders)}
                  </div>
                ))}
              </Messages>
            );
          } else {
            return (
              <button
                style={chatButtonsStyle}
                onClick={() => joinRoom(currentChat.chatName)}
              >
                Join {currentChat.chatName}
              </button>
            );
          }
          break;
        default:
          return <div>Loading Chat...</div>;
      }
    }
  }, [
    messages,
    ChannelUserRoles,
    currentChat,
    props,
    joinRoom,
    joinPrivateRoom,
    excludedSenders,
  ]);

  return <>{content}</>;
};
export default ChatBodyDiv;
