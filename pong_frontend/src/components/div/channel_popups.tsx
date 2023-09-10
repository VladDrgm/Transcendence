import { Dispatch, SetStateAction } from 'react';
import { Channel, ChatData, ChatName, ChatProps } from '../../interfaces/channel.interface';
import { modBannedUser, CreateChannel, addMuteUser, fetchAllChannels} from './channel_utils';
import { deleteChannelPassword, postChannelUser, postMuteUser, postPrivateChannelUser, putChannelPassword, putChannelType } from '../../api/channel/channel_user.api';
import { getChannel } from '../../api/channel/channel.api';

export function banUserPopUp(props: &ChatProps, currentChat: ChatData, banUserSocket: any, unbanUserSocket: any) {
    
    var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

    const newBlockedLabel = document.createElement("h1");
    newBlockedLabel.textContent = "User to be Banned / Unbanned from the Channel";
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
        modBannedUser(true, newBlockedUserName, props, currentChat, banUserSocket, unbanUserSocket);
        popup?.close();
    });
    popup?.document.body.appendChild(addBlockButton);
    var addUnblockButton = document.createElement('button');
    addUnblockButton.innerHTML = 'Unban';
    addUnblockButton.addEventListener('click', function() {
        var newUnblockedUserName = newBlockedUserNameInput.value;
        modBannedUser(false, newUnblockedUserName, props, currentChat, banUserSocket, unbanUserSocket);
        popup?.close();
    });
    popup?.document.body.appendChild(addUnblockButton);
}

export function muteUserPopUp(props: &ChatProps, currentChat: ChatData, muteUserSocket: any) {
    var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

    const newBlockedLabel = document.createElement("h1");
    newBlockedLabel.textContent = "User to be Muted in the Channel";
    popup?.document.body.appendChild(newBlockedLabel);

    var newMutedUserNameInput = document.createElement('input');
    newMutedUserNameInput.type = 'text';
    newMutedUserNameInput.placeholder = "Enter Target Username";
    popup?.document.body.appendChild(newMutedUserNameInput);

    var newMutedUserDurationInput = document.createElement('input');
    newMutedUserDurationInput.type = 'number';
    newMutedUserDurationInput.placeholder = "Enter Duration of Muting in min";
    popup?.document.body.appendChild(newMutedUserDurationInput);

    var addMuteButton = document.createElement('button');
    addMuteButton.innerHTML = 'Mute';
    addMuteButton.addEventListener('click', function() {
        var newMutedUserName = newMutedUserNameInput.value;
        var newMutedUserDuration = newMutedUserDurationInput.valueAsNumber;
        if (!isNaN(newMutedUserDuration)) { // Check if it's a valid number
            addMuteUser(newMutedUserName, newMutedUserDuration, props, currentChat, muteUserSocket);
            popup?.close();
        } else {
            alert("Invalid duration. Please enter a valid number.");
            popup?.close();
        }
    });
    popup?.document.body.appendChild(addMuteButton)
}

export function kickUserPopUp(props: &ChatProps, currenchat: ChatData, banUserSocket: any, unbanUserSocket: any) {
    
    // Open Window
    var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

    const newBlockedLabel = document.createElement("h1");
    newBlockedLabel.textContent = "User to be Kicked from the Channel";
    popup?.document.body.appendChild(newBlockedLabel);

    var newBlockedUserNameInput = document.createElement('input');
    newBlockedUserNameInput.type = 'text';
    newBlockedUserNameInput.placeholder = "Enter Target Username";
    popup?.document.body.appendChild(newBlockedUserNameInput);

    var addKickFiveButton = document.createElement('button');
    addKickFiveButton.innerHTML = 'Kick 5min';
    addKickFiveButton.addEventListener('click', function() {
        var newUnblockedUserName = newBlockedUserNameInput.value;
        modBannedUser(true, newUnblockedUserName, props, currenchat, banUserSocket, unbanUserSocket);
        popup?.close();
        const fiveMin = 5 * 60 * 1000;
        setTimeout(() => {
            modBannedUser(false, newUnblockedUserName, props, currenchat, banUserSocket, unbanUserSocket);
        }, fiveMin);
    });
    popup?.document.body.appendChild(addKickFiveButton);

    var addKickFifteenButton = document.createElement('button');
    addKickFifteenButton.innerHTML = 'Kick 15min';
    addKickFifteenButton.addEventListener('click', function() {
        var newUnblockedUserName = newBlockedUserNameInput.value;
        modBannedUser(true, newUnblockedUserName, props, currenchat, banUserSocket, unbanUserSocket);
        popup?.close();
        const fifteenMin = 15 * 60 * 1000;
        setTimeout(() => {
            modBannedUser(false, newUnblockedUserName, props, currenchat, banUserSocket, unbanUserSocket);
        }, fifteenMin);
    });
    popup?.document.body.appendChild(addKickFifteenButton);
}

//opens the window for adding Usersnames as Admins and passes the input to addAdmin()
export function addAdminPopUp(props:  &ChatProps, addAdminRights:(TargetName: string, chatName: ChatName) => void, currentChat: ChatData) {
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

        addAdminRights(newAdminUserName, currentChat.chatName);
        // addAdmin(newAdminUserName, props);
        popup?.close();
    });
    popup?.document.body.appendChild(addAdminButton);

}

export function changePasswordPopUp(
    props:  &ChatProps,
    currentChat: ChatData,
    updateChannellist: () => void,
    changeChatRoom: (chatName: ChatName) => void) {
    // Open Window
    var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

    const newPwLabel = document.createElement("h1");
    newPwLabel.textContent = "New Passowrd:";
    popup?.document.body.appendChild(newPwLabel);

    var newPwInput = document.createElement('input');
    newPwInput.type = 'text';
    newPwInput.placeholder = "Enter new Channel Password";
    popup?.document.body.appendChild(newPwInput);

    var changePwButton = document.createElement('button');
    changePwButton.innerHTML = 'Update Password';
    changePwButton.addEventListener('click', function() {
        var newPw = newPwInput.value;
        if (newPw === ""){
            deleteChannelPassword(props?.userID, currentChat.Channel.ChannelId, props.user!)
            .then(() => {
                changeChatRoom(currentChat.chatName);
                console.log("Password removed");
                if (currentChat.Channel.Type === "private"){
                    putChannelType(props?.userID, currentChat.Channel.ChannelId, props.user!)
                    .then(() => {
                        changeChatRoom(currentChat.chatName);
                        updateChannellist();
                        console.log("Channel Type changed to public");
                    })
                    .catch(error => {
                        console.error("Error changing channel Type:", error);
                    });
                }
            })
            .catch(error => {
                console.error("Error removing Password:", error);
            });
        }
        putChannelPassword(props.userID, currentChat.Channel.ChannelId, newPw, props.user!)
        .then(() => {
            console.log("Password updated");
            if (currentChat.Channel.Type === "public"){
                putChannelType(props.userID, currentChat.Channel.ChannelId, props.user!)
                .then(() => {
                    changeChatRoom(currentChat.chatName);
                    updateChannellist();
                    console.log("Channel Type changed to private");
                })
                .catch(error => {
                    console.error("Error changing channele type:", error);
                });
            }
        })
        .catch(error => {
            console.error("Error changing Password:", error);
        })
        popup?.close();
    });
    popup?.document.body.appendChild(changePwButton);

    var removePwButton = document.createElement('button');
    removePwButton.innerHTML = 'Remove Password';
    removePwButton.addEventListener('click', function() {
        deleteChannelPassword(props.userID, currentChat.Channel.ChannelId, props.user!)
        .then(() => {
            console.log("Password removed");
            if (currentChat.Channel.Type === "private"){
                putChannelType(props.userID, currentChat.Channel.ChannelId, props.user!)
                .then(() => {
                    changeChatRoom(currentChat.chatName);
                    updateChannellist();
                    console.log("Channel Type changed to public");
                })
                .catch(error => {
                    console.error("Error changing channel Type:", error);
                });
            }

        })
        .catch(error => {
            console.error("Error changing Password:", error);
        });
        popup?.close();
    });
    popup?.document.body.appendChild(removePwButton);

}


export function popUpCreateChannel(
    props: ChatProps,
    updateChannellist: any,
    addChatRoom: (chatName: ChatName) => void
    ){
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
    createButton.classList.add("createButton_style"); 
    createButton.addEventListener('click', function() {
        var channelName = channelNameInput.value;
        var password = channelPasswordInput.value;
        CreateChannel(props, channelName, password)
        .then(result => {
            if (result){
                //updating Channelllists
                addChatRoom(channelName);
				updateChannellist();
            }
        })
        .catch(error => {
            console.error("Error creating Channel: ", error);
        })
        popup?.close();
    });
    popup?.document.body.appendChild(createButton);
}

export async function popUpJoinPrivateChannel(props: ChatProps, currentChat: ChatData ,joinPrivateRoom: (chatName: ChatName, password: string) => void){
    var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');

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
        var password = channelPasswordInput.value;
        joinPrivateRoom(currentChat.chatName, password);
        popup?.close();
    });
    popup?.document.body.appendChild(createButton);
}
