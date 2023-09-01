import React, { useEffect, useState } from 'react';
import  {ChatData, ChatName, ChatProps} from '../../interfaces/channel.interface';
import { addAdminPopUp, banUserPopUp, changePasswordPopUp, kickUserPopUp, muteUserPopUp } from './channel_popups';
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
  }



export const ChannelOwner_Buttons_Div: React.FC<ownerButtonProps> = (props ) => {
    return (
        props.loadingChannelPanel ? (
            <div>Loading Channel Name and Buttons...</div> // Show a loading spinner or placeholder
        ) : (
            <ChannelInfo>
                {props.currentChat.chatName}
                <div>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => deleteChannel(props.chatProps, props.currentChat, props.updateChannellist, props.toggleChat, props.generalChat)}>
                    Delete Channel
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => changePasswordPopUp(props.chatProps, props.currentChat, props.updateChannellist)}>
                    Change Password protection
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => addAdminPopUp(props.chatProps, props.addAdminRights, props.currentChat)}>
                    Add Admin
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => banUserPopUp(props.chatProps, props.currentChat)}>
                    Ban User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => kickUserPopUp(props.chatProps, props.currentChat)}>
                    Kick User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => muteUserPopUp(props.chatProps, props.currentChat)}>
                    Mute User
                    </button>
                </div>
            </ChannelInfo>
        )
    );
};



export const ChannelAdmin_Buttons_Div: React.FC<ownerButtonProps> = (props) => {
    return (
        props.loadingChannelPanel ? (
            <div>Loading Channel Name and Buttons...</div> // Show a loading spinner or placeholder
        ) : (
            <ChannelInfo>
                {props.currentChat.chatName}
                <div>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => banUserPopUp(props.chatProps, props.currentChat)}>
                    Ban User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => kickUserPopUp(props.chatProps, props.currentChat)}>
                    Kick User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => muteUserPopUp(props.chatProps, props.currentChat)}>
                    Mute User
                    </button>
                </div>
            </ChannelInfo>
        )
    );
};