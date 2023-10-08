import React, { Dispatch, SetStateAction } from 'react';
import { Channel, ChatData, ChatProps } from '../../interfaces/Channel';
import { getChannels} from '../../api/channel/channel.api';
import { postChannelUserBlocked, deleteChannelUserBlocked, getUsers, postMuteUser} from '../../api/channel/channel_user.api';
import {IUser} from '../../interfaces/IUser';
import { fetchAddress } from './ChannelDiv';
import { Row } from '../mainPages/ChatPageStyles';
import { ChatName } from '../mainPages/Arena_Chat';

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
    let currentChat: ChatData = {
    chatName: room.Name,
    isChannel: true,
    chatId: undefined,
    receiverId: "",
    senderId: undefined,
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
    const TargetChannel = ChannelList.find((channel: Channel) => channel.Name === ChannelName)
    if (TargetChannel) {
        return TargetChannel.ChannelId;

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
                .then((response) => {
                    if (response){
                        banUserSocket(targetID, currentChat.chatName);
                        alert("User is banned");
                    }
                    else
                        alert("Error banning User");

                })
                .catch(error => {
                    alert("Error banning User");
                })
            else
                deleteChannelUserBlocked(props?.userID, targetID, currentChat.Channel.ChannelId, props.user!)
                .then(() => {
                    unbanUserSocket(targetID, currentChat.chatName);
                })
                .catch(error => {
                    alert("Error unbanning User");
                })
    } else {
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
    getUserIDByUserName(newBlockedUsername)
    .then((targetID) => {
        if (targetID !== undefined) {
            postMuteUser(props?.userID, targetID, currentChat.Channel.ChannelId, duration, props.user!)
             .then((response) => {
                 const socketDuration = (duration * 60 * 1000) + 100;
                 if (response)
                    muteUserSocket(targetID, currentChat.chatName, socketDuration);
                else
                    alert ("Error muting User")
             })

        }
        else {
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
    const ChannelData = {
        "intraUsername": props.user?.intraUsername,
        "passwordHash": props.user?.passwordHash
    }
    const jsonData = JSON.stringify(ChannelData);
    var fetchUrl = fetchAddress + 'channel/' + props.user?.userID + '/' + props.user?.userID + '/' + channelName + '/' + channelType;
    if (channelType === "private") fetchUrl = fetchUrl.concat('?channelPassword=' + password);
    return fetch(fetchUrl, {credentials: "include",
        method:"POST",
        headers: {
            "Content-Type": "application/json"
          },
        body:jsonData
    })
    .then(response => response.json())
    .then(data => {
        return true;
    })
    .catch(error => {
        return false;
    })
}