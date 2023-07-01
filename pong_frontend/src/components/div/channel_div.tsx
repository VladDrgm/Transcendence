import React, { useEffect, useState } from 'react';
import { Channel } from '../../interfaces/channel.interface';
import { getChannels, postAdmin, postChannel, getChannelUser, postChannelUser, deleteChannel } from '../../api/channel.api';
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

export async function copyChannelByName(channelName: string): Promise<Channel | undefined> {
    const channelList = await fetchChannels();
    const originalChannel = channelList.find(channel => channel.Name === channelName)
    if (originalChannel) {
        const copiedChannel: Channel = { ...originalChannel};
        return copiedChannel;
    }
    return undefined;
}

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

export async function isChannelUser(userId: number, channelId: number): Promise<boolean> {
    try {
        const channelUser = await getChannelUser(userId, channelId);
        return !!channelUser; // Converts channelUser to boolean 
    } catch (error){
        console.error('Error occured, or empty JSON resposne from getChannelUser, in isUserChannel:', error);
		return false;
    }
}

const Channel_Div: React.FC<ChatProps> = (props) => {
    const [allChannels, setAllChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    function renderRooms(room: Channel) {
		let currentChat: ChatData = {
		chatName: room.Name,
		isChannel: true,
		receiverId: "",
        Channel: {} as Channel,
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
            "Type": channelType,
            "Password": password,
            "OwnerId": 1
        }

        const jsonData = JSON.stringify(ChannelData);
        fetch(fetchAddress + 'channel', {credentials: "include",
            method:"POST",
			headers: {
				"Content-Type": "application/json"
			  },
            body:jsonData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Channel created:", data);
            //User needs to be changed based on the real user after login is finished
	        console.log("Posting User 1 in Channel:", props.currentChat.Channel.ChannelId);
	        postChannelUser(1, props.currentChat.Channel.ChannelId);
        })
        .catch(error => {
            console.log("Error creating channel:", error);
        })
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
            {/* <button onClick={() => deleteChannel(props.currentChat.Channel.ChannelId)}>
			Delete Channel
		    </button> */}
            {allChannels.length > 0 ? allChannels.map(renderRooms) : 'noChannels'}
            </div>
    );

};

export default Channel_Div;