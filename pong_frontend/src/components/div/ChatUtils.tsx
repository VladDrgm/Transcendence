import { getBlockedUsers } from "../../api/block_user.api";
import { ChatProps, ChatData, Channel, Message } from "../../interfaces/Channel";
import { User } from "../../interfaces/User";
import { UserContextProvider, useUserContext } from "../context/UserContext";
import { Row } from "../mainPages/ChatPageStyles";
import { getUserIDByUserName } from "./ChannelUtils";


export function renderUser(user: User, props: ChatProps, toggleChat: any) {
    if (user.username === props.user?.username) {
      return (
          <Row key={user.userID}>
          You: {user.username}
          </Row>
      );
    }
    let newName = "-1";
    let currentChat: ChatData;
    getUserIDByUserName(user.username)
    .then((result) => {
        if(result){
            if (result < props.user!.userID)
                newName = `${result}-${props.user!.userID}`
            else
            newName = `${props.user!.userID}-${result}`
        }
        currentChat = {
            chatName: newName,
            chatId: `${user.username}`,
            isChannel: false,
            receiverId: user.socketId,
            senderId: props.user?.socketId,
            isResolved: true,
            Channel: {} as Channel,
        };
        // console.log(newName);
    })
    .catch((error) => {
        console.error("Error fetching user ID:", error);
    });
    return (
    <Row onClick={() => {
        toggleChat(currentChat);
    }} key={user.userID}>
        {user.username}
    </Row>
    );
}

// export function renderMessages(message: Message, index: number) {
//     return (
//         <div key={index} style={{ display: 'flex', alignItems: 'center'}}>
//         <h3 style={{ marginRight: '5px' }}> {message.sender}:</h3>
//         <p>{message.content}</p>
//         </div>
//     );
// }

export async function extractExcludedSenders(user: User): Promise<string[]> {
  try {
    const response = await getBlockedUsers(user!);
    if (Array.isArray(response)) {
      const excludedSenders = response.map((entry) => entry.blockedUser.username);
      return excludedSenders;
    } else {
      console.error('API response is not an array.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    return [];
  }
}

// // Usage example:
// extractExcludedSenders()
//   .then((excludedSenders) => {
//     // You can use the excludedSenders array here
//     console.log('Excluded senders:', excludedSenders);
//   })
//   .catch((error) => {
//     // Handle any errors that may occur during the extraction
//     console.error('Error during extraction:', error);
//   });




export function renderMessages(message: Message, index: number, excludedSenders: string[]) {
    if(message.sender){
        if (!excludedSenders.includes(message.sender)) {
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ marginRight: '5px' }}>{message.sender}:</h3>
              <p>{message.content}</p>
            </div>
          );
        } else {
          return null; // Skip rendering this message
        }
    }
  }
  
