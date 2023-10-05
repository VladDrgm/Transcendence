import React, { useEffect, useState } from 'react';
import { Channel, Channel_Div_props } from '../../interfaces/Channel';
import {renderRooms, fetchPublicChannels, fetchPrivateChannels} from './ChannelUtils';
import {  popUpCreateChannel } from './ChannelPopups';
import { chatButtonsStyle } from '../mainPages/ChatPageStyles';

export var fetchAddress= `${process.env.REACT_APP_BASE_URL}` 

const ChannelDiv: React.FC<Channel_Div_props> = (props) => {
    const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
    const [privateChannels, setPrivateChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPublicChannels(setPublicChannels, setLoading);
        fetchPrivateChannels(setPrivateChannels, setLoading);
      }, [props.allChannels]);
    if (loading) {
        return <div>Loading channels...</div>;
    }
    return (
        <div>
            <h3>Channels</h3>
            <button 
            style={chatButtonsStyle}
            onClick={() => popUpCreateChannel(props.ChatProps, props.updateChannellist, props.addChatRoom)}>
			Create Channel
		    </button>
            {/* <button onClick={() => popUpJoinPrivateChannel(props.ChatProps, props.currentChat, props.joinPrivateRoom )}>
			Join private Channel
		    </button> */}
            <h3>Public Channels</h3>
            {publicChannels.length > 0 ? (
                publicChannels.map((room) => (
                    <div key={room.ChannelId}>
                        {renderRooms(props.ChatProps, room, props.toggleChat)}
                    </div>
                ))
            ) : ( 'no public Channels' )}
            <h3>Private Channels</h3>
            {privateChannels.length > 0 ? (
                privateChannels.map((room) => (
                    <div key={room.ChannelId}>
                        {renderRooms(props.ChatProps, room, props.toggleChat)}
                    </div>
                ))
            ) : ( 'no public Channels' )}
            {/* {privateChannels.length > 0 ? privateChannels.map((room) => renderRooms(props.ChatProps, room, props.toggleChat)) : 'no privat Channels joined'} */}
            </div>
    );

};

export default ChannelDiv;