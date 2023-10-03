import { ChatProps, ChatData, Channel, Message } from "../../interfaces/Channel";
import { User } from "../../interfaces/User";
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

export function renderMessages(message: Message, index: number) {
    return (
        <div key={index} style={{ display: 'flex', alignItems: 'center'}}>
        <h3 style={{ marginRight: '5px' }}> {message.sender}:</h3>
        <p>{message.content}</p>
        </div>
    );
}
