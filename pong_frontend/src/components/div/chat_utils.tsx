import { ChatProps, ChatData, Channel, Message } from "../../interfaces/channel.interface";
import { User } from "../../interfaces/user.interface";
import { Row } from "../mainPages/ChatPageStyles";

export function renderUser(user: User, props: ChatProps, toggleChat: any) {
    if (user.username === props.user?.username) {
      return (
          <Row key={user.userID}>
          You: {user.username}
          </Row>
      );
    }
    const currentChat: ChatData = {
    chatName: user.username,
    isChannel: false,
    receiverId: user.socketId,
    isResolved: true,
    Channel: {} as Channel,
    };
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
