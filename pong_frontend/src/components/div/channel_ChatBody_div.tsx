import React, { KeyboardEvent } from 'react';
import { ChatProps, Message } from '../../interfaces/channel.interface';
import { Messages, TextBox, renderMessages } from './chat_utils';
import { popUpJoinPrivateChannel } from './channel_popups';

interface ChatBodyProps {
  props: ChatProps;
  isUserInChannelBlocked: boolean;
  isUserInChannel: boolean;
  isAdmin: boolean;
  isAdminResolved: boolean;
  loadingChatBody: boolean;
  messages: Message[];
}

const ChatBody_Div: React.FC<ChatBodyProps> = ({
  props,
  isUserInChannelBlocked,
  isUserInChannel,
  isAdmin,
  isAdminResolved,
  loadingChatBody,
  messages
}) => {
  if (isUserInChannelBlocked) {
    return loadingChatBody ? (
      <div>Loading Chat...</div>
    ) : (
      <TextBox>You are blocked from using this Channel.</TextBox>
    );
  }
  console.log("Channel type: ", props.currentChat.Channel.Type);
  switch (props.currentChat.Channel.Type) {
    case "private":
      if (isUserInChannel ||
        (isAdmin && isAdminResolved)) {
        return loadingChatBody ? (
          <div>Loading Chat...</div>
        ) : (
          <Messages>{messages.map(renderMessages)}</Messages>
        );
      } else {
        return loadingChatBody ? (
          <div>Loading Chat...</div>
        ) : (
          <button onClick={() => popUpJoinPrivateChannel(props)}>
            Join private Channel {props.currentChat.chatName}
          </button>
        );
      }
    case "public":
      if (
        isUserInChannel ||
        !props.currentChat.isChannel ||
        (isAdmin && isAdminResolved) 
        // || props.connectedRooms.includes(props.currentChat.chatName.toString())
      ) {
        return loadingChatBody ? (
          <div>Loading Chat...</div>
        ) : (
          <Messages>{messages.map(renderMessages)}</Messages>
        );
      } else {
        return loadingChatBody ? (
          <div>Loading Chat...</div>
        ) : (
          <button onClick={() => props.joinRoom(props.currentChat.chatName, "public", "")}>
            Join {props.currentChat.chatName}
          </button>
        );
      }
      default:
        return (
         <div>Loading Chat...</div>);
    }
};

export default ChatBody_Div;


// const ChatBody_Div: React.FC<ChatBodyProps> = ({
//   props,
//   isUserInChannelBlocked,
//   isUserInChannel,
//   isAdmin,
//   isAdminResolved,
//   loadingChatBody,
//   messages
// }) => {
//   if (isUserInChannelBlocked) {
//     return ( 
//       loadingChatBody ? (
//       <div>Loading Chat...</div> // Show a loading spinner or placeholder
//       ) : (
//         <TextBox>
//           You are blocked from using this Channel.
//         </TextBox>
//         // setLoadingChatBody(true);
//       )
//     );
//   } else if(props.currentChat.Channel.Type === "private"){
//     if (isUserInChannel){
//       return(
//         loadingChatBody ? (
//           <div>Loading Chat...</div> // Show a loading spinner or placeholder
//           ) :(  
//           <Messages>
//             {messages.map(renderMessages)}
//           </Messages>       
//         )
//       )
//     }
//     return (
//       loadingChatBody ? (
//         <div>Loading Chat...</div> // Show a loading spinner or placeholder
//         ) : (
//         <button onClick={() => popUpJoinPrivateChannel(props)}>
//           Join private Channel {props.currentChat.chatName}
//         </button>
//         )
//   );
//   }  else if ((isUserInChannel || !props.currentChat.isChannel) || (isAdmin && isAdminResolved) || props.connectedRooms.includes(props.currentChat.chatName.toString())) {
//     return (
//       loadingChatBody ? (
//         <div>Loading Chat...</div> // Show a loading spinner or placeholder
//         ) : (
//         <Messages>
//           {messages.map(renderMessages)}
//         </Messages>)
//       );
//   }  else {
//     return (
//       loadingChatBody ? (
//         <div>Loading Chat...</div> // Show a loading spinner or placeholder
//         ) : (
//         <button onClick={() => props.joinRoom(props.currentChat.chatName)}>
//           Join {props.currentChat.chatName}
//         </button>
//         )
//     );
//   }
// };

// export default ChatBody_Div;
