import React, { useEffect, useState } from 'react';
import { Channel } from '../../interfaces/channel.interface';
import { getChannels, postChannel } from '../../api/channel.api';
import  {ChatProps, ChatData, Message, User} from '../../interfaces/channel.interface';
import styled from "styled-components";

var fetchAddress = 'http://localhost:3000/';

function mapChannel(item: any) {
    const { ChannelId, OwnerId, Name, Type, Password } = item;
    return {
        ChannelId,
        OwnerId,
        Name,
        Type,
        Password
    };
}


const Row = styled.div`
  cursor: pointer;
`;

export async function fetchChannels(): Promise<Channel[]> {
    try{
        const response = await getChannels();
        const channelList = Array.isArray(response) ? response.map(mapChannel) : [];
        return channelList;
    } catch (error){
        console.error('Error fetching channels:', error);
        return [];
    }
};

export async function fetchChannelNames(): Promise<string[]> {
    try{
        const response = await getChannels();
        const channelList = Array.isArray(response) ? response.map(mapChannel) : [];
        const channelNames = channelList.map(channel => channel.Name)
        return channelNames;
    } catch (error){
        console.error('Error fetching channel names:', error);
        return [];
    }
};

const Channel_Div: React.FC<ChatProps> = (props) => {
    const [allChannels, setAllChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    function renderRooms(room: Channel) {
		let currentChat: ChatData = {
		chatName: room.Name,
		isChannel: true,
		receiverId: "",
		};
		return (
		<Row onClick={() => props.toggleChat(currentChat)} key={room.Name}>
			{room.Name}
		</Row>
		);
	}

    function CreateChannel(channelName: String, password: String){
        if(password == "")
            var channelType = "public";
        else
            var channelType = "private";
        const ChannelData = {
            "Name": channelName,
            "OwnerId": 2,
            "Type": channelType,
            "Password": password
        }

        // const jsonData = JSON.stringify(ChannelData);
        // console.log("jsonData", jsonData);
        console.log("ChannelData", ChannelData);
        postChannel(ChannelData);
    }

    function popUpCreateChannel(){
        // Open Window
        var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

        const channelNameLabel = document.createElement("h1");
        channelNameLabel.textContent = "Channel Name:";
        popup?.document.body.appendChild(channelNameLabel);

        var channelNameInput = document.createElement('input');
        channelNameInput.type = 'text';
        channelNameInput.placeholder = "Enter new Channel Name";
        popup?.document.body.appendChild(channelNameInput);

        const channelPasswordLabel = document.createElement("h1");
        channelPasswordLabel.textContent = "Channel Password:";
        popup?.document.body.appendChild(channelPasswordLabel);

        var channelPasswordInput = document.createElement('input');
        channelPasswordInput.type = 'text';
        channelPasswordInput.placeholder = "for public channels leave empty";
        popup?.document.body.appendChild(channelPasswordInput);

        var createButton = document.createElement('button');
        createButton.innerHTML = 'Create';
        createButton.addEventListener('click', function() {
            var channelName = channelNameInput.value;
            var password = channelPasswordInput.value;

            CreateChannel(channelName, password);
            popup?.close();
        });
        popup?.document.body.appendChild(createButton);
    }

    async function fetchChannels(){
		try{
			const response = await getChannels();
			const channelList = Array.isArray(response) ? response.map(mapChannel) : [];
			setAllChannels(channelList);
            setLoading(false);
		} catch (error){
			console.error('Error fetching channels:', error);
            setLoading(false);
		}
	}
    useEffect(() => {
        fetchChannels();
      });
    if (loading) {
        return <div>Loading channels...</div>;
    }
    return (
        <div>
            <h3>Channels</h3>
            <button onClick={() => popUpCreateChannel()}>
			Create Channel
		    </button>
            {/* <button onClick={() => props.joinRoom(props.currentChat.chatName)}>
			Join private Channel
		    </button> */}
            {allChannels.length > 0 ? allChannels.map(renderRooms) : 'noChannels'}
            </div>
    );

};

export default Channel_Div;