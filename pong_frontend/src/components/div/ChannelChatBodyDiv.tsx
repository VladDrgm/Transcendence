import React, { useCallback, useEffect, useState } from 'react';
import { ChannelUserRoles, ChatData, ChatName, ChatProps, Message } from '../../interfaces/Channel';
import {renderMessages } from './ChatUtils';
import { popUpJoinPrivateChannel } from './ChannelPopups';
import { Messages, chatButtonsStyle } from '../mainPages/ChatPageStyles';
import {extractExcludedSenders} from './ChatUtils';

interface ChatBodyProps {
  props: ChatProps;
  messages: Message[];
  ChannelUserRoles: ChannelUserRoles;
  joinRoom: (chatName: ChatName) => void;
	joinPrivateRoom: (chatName: ChatName, password: string) => void;
  currentChat: ChatData;
}

const ChatBodyDiv: React.FC<ChatBodyProps> = ({
  props,
  messages = [],
  ChannelUserRoles,
  joinRoom,
  currentChat,
  joinPrivateRoom
}) => {
  const [excludedSenders, setExcludedSenders] = useState<string[]>([]);
  // const [content, setContent] = useState<JSX.Element | null>(null);
  let content: JSX.Element | null = null;

  useEffect(() => {
    extractExcludedSenders(props.user!)
      .then((excluded) => {
        setExcludedSenders(excluded);
      })
      .catch((error) => {
        console.error('Error during extracting exludedSenders:', error);
      });
  }, [props.user, messages, ChannelUserRoles]);

  // const fetchExcludedSenders = useCallback(() => {
  //   extractExcludedSenders(props.user!)
  //     .then((excluded) => {
  //       setExcludedSenders(excluded);
  //     })
  //     .catch((error) => {
  //       console.error('Error during extracting excludedSenders:', error);
  //     });
  // }, [props.user, messages, ChannelUserRoles]);

  // fetchExcludedSenders();

  useEffect(() => {
    if (!currentChat.isChannel) {
      content = (
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
      content = (<div>Loading Chat...</div>);
    } else if (ChannelUserRoles.isBlocked && ChannelUserRoles.isBlockedResolved) {
      content = (<div>You are blocked from using this Channel.</div>);
    } else {
      switch (currentChat.Channel.Type) {
        case 'private':
          if (
            ChannelUserRoles.isUser ||
            (ChannelUserRoles.isAdmin && ChannelUserRoles.isUser) ||
            ChannelUserRoles.isOwner ||
            !currentChat.isChannel
          ) {
            content = (
              <Messages>
                {messages.map((message, index) => (
                  <div key={index}>
                    {renderMessages(message, index, excludedSenders)}
                  </div>
                ))}
              </Messages>
            );
          } else {
            content = (
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
            (ChannelUserRoles.isAdmin && ChannelUserRoles.isUser)||
            ChannelUserRoles.isOwner ||
            !currentChat.isChannel
          ) {
            content = (
              <Messages>
                {messages.map((message, index) => (
                  <div key={index}>
                    {renderMessages(message, index, excludedSenders)}
                  </div>
                ))}
              </Messages>
            );
          } else {
            content = (
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
          content = (<div>Loading Chat 2...</div>);
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
