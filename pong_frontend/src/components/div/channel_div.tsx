import React, { useEffect, useState } from 'react';
import { Channel } from '../../interfaces/channel.interface';
import { getChannels} from '../../api/channel.api';
import  {ChatProps} from '../../interfaces/channel.interface';
import {renderRooms, fetchPublicChannels} from './channel_utils';
import { popUpJoinPrivateChannel, popUpCreateChannel } from './channel_popups';
// import {IUser} from '../../interfaces/interface';
import styled from "styled-components";
import { Row } from '../main_div/Chat_MainDiv';
// import { ConsoleLogger } from '@nestjs/common';
// import { channel } from 'diagnostics_channel';

export var fetchAddress = 'http://localhost:3000/';

// export async function isChannelUser(userId: number, channelId: number): Promise<boolean> {
//     try {
//         console.log('userId:', userId);
//         console.log('channelId:', channelId);
//         const response = await getChannelUser(userId, channelId);
//         if (!response.headers.has("content-length")) {
//             return false;
//         }
//         if (!response.ok) {
//             console.error("Error retrieving ChannelUser: ", error);
//             return false;
//         }
//         const json = await response.json();
//         return !!json; // Converts channelUser to boolean 
//     } catch (error){
//         console.log('Error occured, or empty JSON response from getChannelUser, in isUserChannel:', error);
// 		return false;
//     }
// }

const Channel_Div: React.FC<ChatProps> = (props) => {
    const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
    const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPublicChannels(setPublicChannels, setLoading);
      });
    if (loading) {
        return <div>Loading channels...</div>;
    }
    return (
        <div>
            <h3>Channels</h3>
            <button onClick={() => popUpCreateChannel(props)}>
			Create Channel
		    </button>
            <button onClick={() => popUpJoinPrivateChannel(setPrivateChannels)}>
			Join private Channel
		    </button>
            <h3>Public Channels</h3>
            {publicChannels.length > 0 ? publicChannels.map((room) => renderRooms(props, room)) : 'no public Channels'}
            <h3>Private Channels</h3>
            {privateChannels.length > 0 ? privateChannels.map((room) => renderRooms(props, room)) : 'no privat Channels joined'}
            </div>
    );

};

export default Channel_Div;