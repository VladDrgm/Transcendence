import styled from "styled-components";
import { ChatProps, ChatData, Channel, Message } from "../../interfaces/channel.interface";
import { User } from "../../interfaces/user.interface";

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
`;

export const SideBar = styled.div`
  height: 100%;
  width: 15%;
  border-right: 1px solid black;
`;

export const ChatPanel = styled.div`
  height: 50%;
  width: 85%;
  display: flex;
  flex-direction: column;
`;

export const BodyContainer = styled.div`
  width: 100%;
  height: 75%;
  overflow: scroll;
  border-bottom: 1px solid black;
`;

export const TextBox = styled.textarea`
  height: 15%;
  width: 100%;
`;

export const ChannelInfo = styled.div`
  height: 10%;
  width: 100%;
  border-bottom: 1px solid black;
`;

export const Row = styled.div`
  cursor: pointer;
`;

export const Messages = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;




export function renderUser(user: User, props: ChatProps) {
    if (user.username === props.user.username) {
      return (
          <Row key={user.userID}>
          You: {user.username}
          </Row>
      );
    }
    const currentChat: ChatData = {
    chatName: user.username,
    isChannel: false,
    receiverId: props.yourId,
    isResolved: true,
    Channel: {} as Channel,
    };
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
