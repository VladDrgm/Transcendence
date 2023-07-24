import { ChatProps, ChatData, Channel, Message } from "../../interfaces/channel.interface";
import { User } from "../../interfaces/user.interface";
import { Row } from "../main_div/Chat_MainDiv";



export function renderUser(user: User, props: ChatProps) {
    // console.log("User id is: " + user.id);
    // console.log("User.username is: " + user.username);
    // console.log("Props id is: " + props.yourId);
    // console.log("Props username is: " + props.username);
    if (user.userID === props.yourId) {
        // console.log("Reached here");
    return (
        <Row key={user.userID}>
        You: {props.username}
        </Row>
    );
    }
    // console.log("Reached here");
    const currentChat: ChatData = {
    chatName: user.username,
    isChannel: false,
    receiverId: user.userID,
    isResolved: true,
    Channel: {} as Channel,
    };
    // console.log("Reached here");
    return (
    <Row onClick={() => {
        props.toggleChat(currentChat);
    }} key={user.userID}>
        {user.username}
    </Row>
    );
}

export function renderMessages(message: Message, index: number) {
    return (
    <div key={index}>
        <h3>{message.sender}</h3>
        <p>{message.content}</p>
    </div>
    );
}
