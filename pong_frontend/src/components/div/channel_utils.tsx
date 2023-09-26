import { Dispatch, SetStateAction } from 'react';
import { Channel, ChatData, ChatProps } from '../../interfaces/channel.interface';
import { getChannels} from '../../api/channel/channel.api';
import { postAdmin } from '../../api/channel/channel_admin.api';
import { postChannelUserBlocked, deleteChannelUserBlocked, getUsers, postChannelUser, postMuteUser, postPrivateChannelUser} from '../../api/channel/channel_user.api';
import styled from "styled-components";
import {IUser} from '../../interfaces/interface';
import { fetchAddress } from './channel_div';
import { Row } from '../mainPages/ChatPageStyles';
import { ChatName, getChannelFromChannellist } from '../mainPages/Arena_Chat';
import { useUserContext } from '../context/UserContext';

export function mapChannel(item: any) {
    const { ChannelId, OwnerId, Name, Type, Password } = item;
    return {
        ChannelId,
        OwnerId,
        Name,
        Type,
        Password
    };
}

export function renderRooms(props: ChatProps, room: Channel, toggleChat: any) {
    // const newChannel = getChannelFromChannellist(props.allChannels, room.Name);
    let currentChat: ChatData = {
    chatName: room.Name,
    isChannel: true,
    receiverId: "",
    isResolved: true,
    Channel: room,
    };
    return (
    <Row onClick={() => toggleChat(currentChat)} key={room.Name}>
        {room.Name}
    </Row>
    );
}

export async function fetchPublicChannels(setPublicChannels: Dispatch<SetStateAction<Channel[]>>, setLoading : Dispatch<SetStateAction<boolean>>): Promise<Channel[]>{
    try{
        const response = await getChannels();
        const channelList = Array.isArray(response) ? response.map(mapChannel) : [];
        const channelListPublic = channelList.filter(channel => channel.Type === "public");
        setPublicChannels(channelListPublic);
        setLoading(false);
        return channelListPublic;
    } catch (error){
        console.error('Error fetching channels:', error);
        setLoading(false);
        return [];
    }
}

export async function fetchPrivateChannels(setPrivateChannels: Dispatch<SetStateAction<Channel[]>>, setLoading : Dispatch<SetStateAction<boolean>>): Promise<Channel[]>{
    try{
        const response = await getChannels();
        const channelList = Array.isArray(response) ? response.map(mapChannel) : [];
        const channelListPrivate = channelList.filter(channel => channel.Type === "private");
        setPrivateChannels(channelListPrivate);
        setLoading(false);
        return channelListPrivate;
    } catch (error){
        console.error('Error fetching channels:', error);
        setLoading(false);
        return [];
    }
}

export async function fetchAllChannels(): Promise<Channel[]> {
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
    const channelList = await fetchAllChannels();
    const originalChannel = channelList.find(channel => channel.Name === channelName)
    if (originalChannel) {
        const copiedChannel: Channel = { ...originalChannel};
        return copiedChannel;
    }
    return undefined;
}

export async function getUserIDByUserName(UserName: string): Promise<number | undefined> {
    const UserList = await getUsers();
    const TargetUser = UserList.find((user: IUser) => user.username === UserName)
    if (TargetUser) {
        return TargetUser.id;
    }
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

// export async function joinPrivateChannel(ChannelID: number, ChannelPassword: string) : Promise<Channel | undefined>{
//     //fetching Channel with ChannelName
//     try {
//         // const ChannelId = getChannelIdByChannelName(ChannelName);
//         // const TargetChannel = await copyChannelByName(ChannelName);
//         // if (TargetChannel?.Password === ChannelPassword)

//         // sending Password to backend to check if its the same
//         // new method for joining private channels?
//         return TargetChannel;

//     } catch (error){
//         console.error("Error joining private Channel: ", error);
//     }
//     //Checking if Channel PW is equal to parameter ChannelPassword
//     //AddChannelUser
//     // return;
// }

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

export async function modBannedUser(
    add: boolean,
    newBlockedUsername: string,
    props: &ChatProps,
    currentChat: ChatData,
    banUserSocket: (targetId: number, chatName: ChatName) => void,
    unbanUserSocket: (targetId: number, chatName: ChatName) => void,
    ){
    const targetID = await getUserIDByUserName(newBlockedUsername);
    if (targetID !== undefined)
        {
            if (add === true)
                postChannelUserBlocked(props?.userID, targetID, currentChat.Channel.ChannelId, props.user!)
                .then(() => {
                    banUserSocket(targetID, currentChat.chatName);
                })
                .catch(error => {
                    console.error("Error banning User:", error);
                    alert("Error unbanning User");
                })
            else
                deleteChannelUserBlocked(props?.userID, targetID, currentChat.Channel.ChannelId, props.user!)
                .then(() => {
                    unbanUserSocket(targetID, currentChat.chatName);
                })
                .catch(error => {
                    console.error("Error unbanning User:", error);
                    alert("Error unbanning User");
                })
    } else {
        console.error('Error banning/allowing User with Username:' , newBlockedUsername);
        alert("Error banning/unbanning User");
    }
}

export async function addMuteUser(
    newBlockedUsername: string,
    duration:number,
    props: &ChatProps,
    currentChat: ChatData,
    muteUserSocket: (targetId: number, chatName: ChatName, mutedDuration: number) => void
    ){
    //finding right UserId to the Username input from banUserPopUp
    getUserIDByUserName(newBlockedUsername)
    .then((targetID) => {
        if (targetID !== undefined) {
            postMuteUser(props?.userID, targetID, currentChat.Channel.ChannelId, duration, props.user!)
             .then(() => {
                 const socketDuration = (duration * 60 * 1000) + 100;
                 muteUserSocket(targetID, currentChat.chatName, socketDuration);
             })

        }
        else {
            console.error('Error muting User with Username:' , newBlockedUsername);
            alert("Error muting User");
        }
    }).catch(error => {
        alert("Error muting user: " + error.message);
    })
}


export async function CreateChannel(props: ChatProps, channelName: string, password: string): Promise<boolean>{
    if(password === "")
        var channelType = "public";
    else
        channelType = "private";
    console.log(props.user?.passwordHash)
    const ChannelData = {
        "intraUsername": props.user?.intraUsername,
        "passwordHash": props.user?.passwordHash
        // "passwordHash": "$2b$10$ZrGltCBM3NsOPTEo3wc6GePgb3yjaSn73kfAfO7fdhb0gSzI0fSt."
        // "channelName": channelName,
        // "channelType": channelType,
        // "channelPassword": password,
        // "ownerId": props.userID
    }
    const jsonData = JSON.stringify(ChannelData);
    return fetch(fetchAddress + 'channel/' + props.user?.userID + '/' + props.user?.userID + '/' + channelName + '/' + channelType, {credentials: "include",
        method:"POST",
        headers: {
            "Content-Type": "application/json"
          },
        body:jsonData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Channel created:", data);
        return true;
    })
    .catch(error => {
        console.log("Error creating channel:", error);
        return false;
    })
}