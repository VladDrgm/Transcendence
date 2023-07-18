import React, { useEffect, useState } from 'react';
import { Channel } from '../../interfaces/channel.interface';
import { getChannels, postAdmin, postChannel, getChannelUser, postChannelUser, deleteChannel, postChannelUserBlocked, deleteChannelUserBlocked, getUsers } from '../../api/channel.api';
import  {ChatProps, ChatData, Message, User} from '../../interfaces/channel.interface';
import {IUser} from '../../interfaces/interface';
import styled from "styled-components";
import { ConsoleLogger } from '@nestjs/common';
import { channel } from 'diagnostics_channel';
// import { error } from 'console';
// import { error } from 'console';
// import { error } from 'console';

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

export async function getUserIDByUserName(UserName: string): Promise<number | undefined> {
    const UserList = await getUsers();
    console.log('getUserIdByUserNAme Userlist:', UserList);
    const TargetUser = UserList.find((user: IUser) => user.username === UserName)
    console.log('getUserIdByUserNAme TargetUser:', TargetUser);
    if (TargetUser) {
        console.log('TargetUser in if:', TargetUser);
        console.log('returned UserID from getUserIDbyUSerNAme:', TargetUser?.userID);
        return TargetUser.userID;

    }
    console.log('returned undefined UserID from getUserIDbyUSerNAme:');
    return undefined;
}

export async function getChannelIdByChannelName(ChannelName: string): Promise<number | undefined> {
    const ChannelList = await getChannels();
    console.log('getChannelIdByChannelName Channnellist:', ChannelList);
    const TargetChannel = ChannelList.find((channel: Channel) => channel.Name === ChannelName)
    console.log('getChannelIdByChannelName TargetChannel:', TargetChannel);
    if (TargetChannel) {
        console.log('TargetChannel in if:', TargetChannel);
        console.log('returned ChannelId from getChannelIdByChannelName:', TargetChannel?.ChannelId);
        return TargetChannel.ChannelId;

    }
    console.log('returned undefined ChannelId from getChannelIdByChannelName:');
    return undefined;
}

export async function joinPrivateChannel(ChannelName: string, ChannelPassword: string) : Promise<Channel | undefined>{
    //fetching Channel with ChannelName
    try {
        // const ChannelId = getChannelIdByChannelName(ChannelName);
        const TargetChannel = await copyChannelByName(ChannelName);
        // if (TargetChannel?.Password === ChannelPassword)

        // sending Password to backend to check if its the same
        // new method for joining private channels?
        return TargetChannel;

    } catch {
        console.error("Error joining private Channel: ", error);
    }
    //Checking if Channel PW is equal to parameter ChannelPassword
    //AddChannelUser
    // return;
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

export async function addAdmin(newAdminUsername: string, props: &ChatProps){
    //finding right UserId to the Username input from addAdminPopUp
    var targetID = await getUserIDByUserName(newAdminUsername);
    // retrieving UserID from getUserID(UserName) from backend maybe
    if (targetID)//changing the 1 to props.yourId or the real UserID of the caller
        {
            postAdmin(props.currentChat.Channel.ChannelId, Number(targetID), 1);
            console.log('Admin added with UserId:', targetID);
    } else 
    console.error('Error adding Admin with Username:' , newAdminUsername);
}

export async function modBannedUser(add: boolean, newBlockedUsername: string, props: &ChatProps){
    //finding right UserId to the Username input from banUserPopUp
    var targetID = await getUserIDByUserName(newBlockedUsername);
    // console.log('TargetId:', targetID);
    if (targetID)//changing the 1 to props.yourId or the real UserID of the caller
        {
            // console.log('User banned with UserId:', targetID);
            if (add === true)
                postChannelUserBlocked(targetID, props.currentChat.Channel.ChannelId);
            else
                deleteChannelUserBlocked(targetID, props.currentChat.Channel.ChannelId);
    } else 
    console.error('Error banning/allowing User with Username:' , newBlockedUsername);
}

export function banUserPopUp(props: &ChatProps) {
    
    // Open Window
    var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

    const newBlockedLabel = document.createElement("h1");
    newBlockedLabel.textContent = "User to be Banned / Unbanned / Kicked from the Channel";
    popup?.document.body.appendChild(newBlockedLabel);

    var newBlockedUserNameInput = document.createElement('input');
    newBlockedUserNameInput.type = 'text';
    newBlockedUserNameInput.placeholder = "Enter Target Username";
    popup?.document.body.appendChild(newBlockedUserNameInput);

    var addBlockButton = document.createElement('button');
    addBlockButton.innerHTML = 'Ban';
    addBlockButton.addEventListener('click', function() {
        var newBlockedUserName = newBlockedUserNameInput.value;
        var newBlockedUserName = newBlockedUserNameInput.value;
        modBannedUser(true, newBlockedUserName, props);
        popup?.close();
    });
    popup?.document.body.appendChild(addBlockButton);
    var addUnblockButton = document.createElement('button');
    addUnblockButton.innerHTML = 'Unban';
    addUnblockButton.addEventListener('click', function() {
        var newUnblockedUserName = newBlockedUserNameInput.value;
        modBannedUser(false, newUnblockedUserName, props);
        popup?.close();
    });
    popup?.document.body.appendChild(addUnblockButton);
    var addKickFiveButton = document.createElement('button');
    addKickFiveButton.innerHTML = 'Kick 5min';
    addKickFiveButton.addEventListener('click', function() {
        var newUnblockedUserName = newBlockedUserNameInput.value;
        modBannedUser(true, newUnblockedUserName, props);
        popup?.close();
        const fiveMin = 5 * 60 * 1000;
        setTimeout(() => {
            modBannedUser(false, newUnblockedUserName, props);
        }, fiveMin);
    });
    popup?.document.body.appendChild(addKickFiveButton);

    var addKickFifteenButton = document.createElement('button');
    addKickFifteenButton.innerHTML = 'Kick 15min';
    addKickFifteenButton.addEventListener('click', function() {
        var newUnblockedUserName = newBlockedUserNameInput.value;
        modBannedUser(true, newUnblockedUserName, props);
        popup?.close();
        const fifteenMin = 15 * 60 * 1000;
        setTimeout(() => {
            modBannedUser(false, newUnblockedUserName, props);
        }, fifteenMin);
    });
    popup?.document.body.appendChild(addKickFifteenButton);

    var addMuteButton = document.createElement('button');
    addMuteButton.innerHTML = 'Mute';
    addMuteButton.addEventListener('click', function() {
        // var newBlockedUserName = newBlockedUserNameInput.value;
        // var newBlockedUserName = newBlockedUserNameInput.value;
        // modBannedUser(true, newBlockedUserName, props);
        popup?.close();
    });
    popup?.document.body.appendChild(addMuteButton)

    var addUnmuteButton = document.createElement('button');
    addUnmuteButton.innerHTML = 'Unmute';
    addUnmuteButton.addEventListener('click', function() {
        // var newBlockedUserName = newBlockedUserNameInput.value;
        // var newBlockedUserName = newBlockedUserNameInput.value;
        // modBannedUser(true, newBlockedUserName, props);
        popup?.close();
    });
    popup?.document.body.appendChild(addUnmuteButton)

}

//opens the window for adding Usersnames as Admins and passes the input to addAdmin()
export function addAdminPopUp(props:  &ChatProps) {
    // Open Window
    var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

    const newAdminLabel = document.createElement("h1");
    newAdminLabel.textContent = "New Admin:";
    popup?.document.body.appendChild(newAdminLabel);

    var newAdminUserNameInput = document.createElement('input');
    newAdminUserNameInput.type = 'text';
    newAdminUserNameInput.placeholder = "Enter new Admin Username";
    popup?.document.body.appendChild(newAdminUserNameInput);

    var addAdminButton = document.createElement('button');
    addAdminButton.innerHTML = 'Add';
    addAdminButton.addEventListener('click', function() {
        var newAdminUserName = newAdminUserNameInput.value;

        addAdmin(newAdminUserName, props);
        popup?.close();
    });
    popup?.document.body.appendChild(addAdminButton);

}

// export function blockUserPopUp(props: &ChatProps) {
    
//     // Open Window
//     var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

//     const newBlockedLabel = document.createElement("h1");
//     newBlockedLabel.textContent = "User to be Blocked/Unblocked";
//     popup?.document.body.appendChild(newBlockedLabel);

//     var newBlockedUserNameInput = document.createElement('input');
//     newBlockedUserNameInput.type = 'text';
//     newBlockedUserNameInput.placeholder = "Enter new Admin Username";
//     popup?.document.body.appendChild(newBlockedUserNameInput);

//     var addBlockButton = document.createElement('button');
//     addBlockButton.innerHTML = 'Block';
//     addBlockButton.addEventListener('click', function() {
//         var newBlockedUserName = newBlockedUserNameInput.value;
//         //waiting for getUSerID by Username
//         // postChannelUserBlocked(getUserID(newBlockedUserName), props.currentChat.Channel.ChannelId);
//         popup?.close();
//     });
//     var addUnblockButton = document.createElement('button');
//     addUnblockButton.innerHTML = 'Unblock';
//     addUnblockButton.addEventListener('click', function() {
//         var newUnblockedUserName = newBlockedUserNameInput.value;
//         //waiting for getUSerID by Username
//         // deleteChannelUserBlocked(getUserID(newBlockedUserName), props.currentChat.Channel.ChannelId);
//         popup?.close();
//     });
//     popup?.document.body.appendChild(addBlockButton);
//     popup?.document.body.appendChild(addUnblockButton);
// }

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
    function renderRooms(room: Channel) {
		let currentChat: ChatData = {
		chatName: room.Name,
		isChannel: true,
		receiverId: "",
        isResolved: false,
        Channel: {} as Channel,
		};
		return (
		<Row onClick={() => props.toggleChat(currentChat)} key={room.Name}>
			{room.Name}
		</Row>
		);
	}

    function CreateChannel(channelName: String, password: String){
        if(password === "")
            var channelType = "public";
        else
            channelType = "private";
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

    async function popUpJoinPrivateChannel(){
        // Open Window
        var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

        const channelNameLabel = document.createElement("h1");
        channelNameLabel.textContent = "Channel Name:";
        popup?.document.body.appendChild(channelNameLabel);

        var channelNameInput = document.createElement('input');
        channelNameInput.type = 'text';
        channelNameInput.placeholder = "Enter Channel Name you wnat to join";
        popup?.document.body.appendChild(channelNameInput);

        const channelPasswordLabel = document.createElement("h1");
        channelPasswordLabel.textContent = "Channel Password:";
        popup?.document.body.appendChild(channelPasswordLabel);

        var channelPasswordInput = document.createElement('input');
        channelPasswordInput.type = 'text';
        channelPasswordInput.placeholder = "Password";
        popup?.document.body.appendChild(channelPasswordInput);

        var createButton = document.createElement('button');
        createButton.innerHTML = 'Join';
        createButton.addEventListener('click', async function() {
            var channelName = channelNameInput.value;
            var password = channelPasswordInput.value;
            const TargetChannel = await joinPrivateChannel(channelName, password);
            if (TargetChannel){
                //adding a channel to the list of shown channels
                setPrivateChannels((prevChannels) => [...prevChannels, TargetChannel]);
                //does Channel creation adds an element to the channelarray of the chatsurface?
            }
            popup?.close();
            // return TargetChannel;
        });
        popup?.document.body.appendChild(createButton);
    }

    async function fetchChannels(){
		try{
			const response = await getChannels();
			const channelList = Array.isArray(response) ? response.map(mapChannel) : [];
            const channelListPublic = channelList.filter(channel => channel.Type === "public");
			setPublicChannels(channelListPublic);
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
            <button onClick={() => popUpJoinPrivateChannel()}>
			Join private Channel
		    </button>
            <h3>Public Channels</h3>
            {publicChannels.length > 0 ? publicChannels.map(renderRooms) : 'no public Channels'}
            <h3>Private Channels</h3>
            {privateChannels.length > 0 ? privateChannels.map(renderRooms) : 'no privat Channels joined'}
            </div>
    );

};

export default Channel_Div;