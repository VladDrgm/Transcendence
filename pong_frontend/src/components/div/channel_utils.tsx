import { Dispatch, SetStateAction } from 'react';
import { Channel, ChatData, ChatProps } from '../../interfaces/channel.interface';
import { getChannels} from '../../api/channel/channel.api';
import { postAdmin } from '../../api/channel/channel_admin.api';
import { postChannelUserBlocked, deleteChannelUserBlocked, getUsers, postChannelUser, postMuteUser, postPrivateChannelUser} from '../../api/channel/channel_user.api';
import styled from "styled-components";
import {IUser} from '../../interfaces/interface';
import { fetchAddress } from './channel_div';
import { Row } from './chat_utils';
import { getChannelFromChannellist } from '../main_div/Arena_Chat';

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

export function renderRooms(props: ChatProps, room: Channel) {
    // const newChannel = getChannelFromChannellist(props.allChannels, room.Name);
    let currentChat: ChatData = {
    chatName: room.Name,
    isChannel: true,
    receiverId: "",
    isResolved: true,
    Channel: room,
    };
    return (
    <Row onClick={() => props.toggleChat(currentChat)} key={room.Name}>
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

export async function addAdmin(newAdminUsername: string, props: &ChatProps){
    //finding right UserId to the Username input from addAdminPopUp
    var targetID = await getUserIDByUserName(newAdminUsername);
    // retrieving UserID from getUserID(UserName) from backend maybe
    if (targetID)//changing the 1 to props.yourId or the real UserID of the caller
        {
            postAdmin(props.currentChat.Channel.ChannelId, Number(targetID), props.userID);
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

export async function addMuteUser(newBlockedUsername: string, duration:number, props: &ChatProps){
    //finding right UserId to the Username input from banUserPopUp
    var targetID = await getUserIDByUserName(newBlockedUsername);
    // console.log('TargetId:', targetID);
    if (targetID)//changing the 1 to props.yourId or the real UserID of the caller
        {
            // console.log('User banned with UserId:', targetID);
            postMuteUser(props.userID, targetID, props.currentChat.Channel.ChannelId, duration);
    } else 
    console.error('Error muting User with Username:' , newBlockedUsername);
}
export async function CreateChannel(props: ChatProps, channelName: string, password: string): Promise<boolean>{
    if(password === "")
        var channelType = "public";
    else
        channelType = "private";
    const ChannelData = {
        "Name": channelName,
        "Type": channelType,
        "Password": password,
        "OwnerId": props.userID
    }
    const jsonData = JSON.stringify(ChannelData);
    return fetch(fetchAddress + 'channel/' + props.userID, {credentials: "include",
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