import React from 'react';
import  {ChatData, ChatName, ChatProps} from '../../interfaces/Channel';
import { addAdminPopUp, banUserPopUp, changePasswordPopUp, kickUserPopUp, muteUserPopUp } from './ChannelPopups';
import { deleteChannel } from '../../api/channel/channel.api';
import { ChannelInfo } from '../mainPages/ChatPageStyles';
import { chatButtonsStyle } from '../mainPages/ChatPageStyles';

export interface LoadingProps {
	loadingChannelPanel: boolean;
}

export interface ownerButtonProps {
    chatProps: ChatProps;
    loadingChannelPanel: boolean;
    currentChat: ChatData;
    updateChannellist: () => void;
    addAdminRights: (TargetName: string, chatName: ChatName) => void
    toggleChat: (currentChat: ChatData) => void;
    generalChat: ChatData;
    changeChatRoom: (chatName: ChatName) => void;
    banUserSocket: (targetId: number, chatName: ChatName) => void;
    unbanUserSocket: (targetId: number, chatName: ChatName) => void;
    muteUserSocket: (targetId: number, chatName: ChatName, mutedDuration: number) => void;
    deleteChatRoom: (chatName: ChatName) => void;
  }



export const ChatBodyDivChannelOwnerButtonsDiv: React.FC<ownerButtonProps> = (props ) => {
    return (
        props.loadingChannelPanel ? (
            <div>Loading Channel Name and Buttons...</div> 
        ) : (
            <ChannelInfo>
                <h3>{props.currentChat.chatName}</h3>
                <div>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => deleteChannel(
                        props.chatProps,
                        props.currentChat,
                        props.updateChannellist,
                        props.toggleChat,
                        props.generalChat,
                        props.deleteChatRoom)}>
                    Delete Channel
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => changePasswordPopUp(props.chatProps, props.currentChat, props.updateChannellist, props.changeChatRoom)}>
                    Change Password protection
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => addAdminPopUp(props.chatProps, props.addAdminRights, props.currentChat)}>
                    Add Admin
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => banUserPopUp(
                        props.chatProps,
                        props.currentChat,
                        props.banUserSocket,
                        props.unbanUserSocket)}>
                    Ban User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => kickUserPopUp(
                        props.chatProps,
                        props.currentChat,
                        props.banUserSocket,
                        props.unbanUserSocket)}>
                    Kick User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => muteUserPopUp(
                        props.chatProps,
                        props.currentChat,
                        props.muteUserSocket)}>
                    Mute User
                    </button>
                </div>
            </ChannelInfo>
        )
    );
};



export const ChannelAdminButtonsDiv: React.FC<ownerButtonProps> = (props) => {
    return (
        props.loadingChannelPanel ? (
            <div>Loading Channel Name and Buttons...</div> 
        ) : (
            <ChannelInfo>
                <h3>{props.currentChat.chatName}</h3>
                <div>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => banUserPopUp(
                        props.chatProps,
                        props.currentChat,
                        props.banUserSocket,
                        props.unbanUserSocket)}>
                    Ban User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => kickUserPopUp(
                        props.chatProps,
                        props.currentChat,
                        props.banUserSocket,
                        props.unbanUserSocket)}>
                    Kick User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => muteUserPopUp(
                        props.chatProps,
                        props.currentChat,
                        props.muteUserSocket)}>
                    Mute User
                    </button>
                </div>
            </ChannelInfo>
        )
    );
};