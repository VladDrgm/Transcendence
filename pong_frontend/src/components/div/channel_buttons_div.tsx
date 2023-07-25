import React, { useEffect, useState } from 'react';
import  {ChatProps} from '../../interfaces/channel.interface';
import { addAdminPopUp, banUserPopUp, kickUserPopUp, muteUserPopUp } from './channel_popups';
import { deleteChannel } from '../../api/channel/channel.api';
import { ChannelInfo } from '../main_div/Chat_MainDiv';

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
                    onClick={() => deleteChannel(props)}>
                    Delete Channel
                    </button>
                    <button
                    onClick={() => addAdminPopUp(props)}>
                    Add Admin
                    </button>
                    <button
                    onClick={() => banUserPopUp(props)}>
                    Ban User
                    </button>
                    <button
                    onClick={() => kickUserPopUp(props)}>
                    Kick User
                    </button>
                    <button
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
                    onClick={() => banUserPopUp(props)}>
                    Ban User
                    </button>
                    <button
                    onClick={() => kickUserPopUp(props)}>
                    Kick User
                    </button>
                    <button
                    onClick={() => muteUserPopUp(props)}>
                    Mute User
                    </button>
                </div>
            </ChannelInfo>
        )
    );
};