import React, { useEffect, useState } from 'react';
import  {ChatProps} from '../../interfaces/channel.interface';
import { addAdminPopUp, banUserPopUp, changePasswordPopUp, kickUserPopUp, muteUserPopUp } from './channel_popups';
import { deleteChannel } from '../../api/channel/channel.api';
import { ChannelInfo } from '../mainPages/ChatPageStyles';
import { chatButtonsStyle } from '../mainPages/ChatPageStyles';

export interface LoadingProps {
	loadingChannelPanel: boolean;
}




export const ChannelOwner_Buttons_Div: React.FC<ChatProps> = (props) => {
    return (
        props.loadingChannelPanel ? (
            <div>Loading Channel Name and Buttons...</div> // Show a loading spinner or placeholder
        ) : (
            <ChannelInfo>
                {props.currentChat.chatName}
                <div>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => deleteChannel(props)}>
                    Delete Channel
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => changePasswordPopUp(props)}>
                    Change Password protection
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => addAdminPopUp(props)}>
                    Add Admin
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => banUserPopUp(props)}>
                    Ban User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => kickUserPopUp(props)}>
                    Kick User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => muteUserPopUp(props)}>
                    Mute User
                    </button>
                </div>
            </ChannelInfo>
        )
    );
};



export const ChannelAdmin_Buttons_Div: React.FC<ChatProps> = (props) => {
    return (
        props.loadingChannelPanel ? (
            <div>Loading Channel Name and Buttons...</div> // Show a loading spinner or placeholder
        ) : (
            <ChannelInfo>
                {props.currentChat.chatName}
                <div>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => banUserPopUp(props)}>
                    Ban User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => kickUserPopUp(props)}>
                    Kick User
                    </button>
                    <button
                    style={chatButtonsStyle}
                    onClick={() => muteUserPopUp(props)}>
                    Mute User
                    </button>
                </div>
            </ChannelInfo>
        )
    );
};