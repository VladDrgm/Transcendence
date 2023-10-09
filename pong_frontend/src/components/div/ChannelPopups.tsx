import { ChatData, ChatName, ChatProps } from '../../interfaces/Channel';
import { modBannedUser, CreateChannel, addMuteUser} from './ChannelUtils';
import { deleteChannelPassword, putChannelPassword, putChannelType } from '../../api/channel/channel_user.api';

export function banUserPopUp(props: &ChatProps, currentChat: ChatData, banUserSocket: any, unbanUserSocket: any) {
    
    var popup = window.open('', '_blank', 'width=250,height=200,menubar=no,toolbar=no');
    if (!popup) {
        alert("Popup blocked. Please allow popups for this site.");
        return;
    }
    const popupDocument = popup.document;

    const styleElement = popupDocument.createElement("style");
    styleElement.textContent = `
        body {
            background-color: black;
            color: white;
            font-family: Shlop, sans-serif;
        }
        h1 {
            font-size: 24px;
        }
        input[type="text"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }
        button {
            background-color: rgba(254, 8, 16, 1);
            font-family: Shlop;
            font-size: 13px;
            color: white;
            border: 2px solid white;
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
        }
        p {
            font-size: 14px;
        }
    `;

    popupDocument.head.appendChild(styleElement);
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
    var popup = window.open('', '_blank', 'width=250,height=200,menubar=no,toolbar=no');
    if (!popup) {
        alert("Popup blocked. Please allow popups for this site.");
        return;
    }
    const popupDocument = popup.document;
    
    const styleElement = popupDocument.createElement("style");
    styleElement.textContent = `
        body {
            background-color: black;
            color: white;
            font-family: Shlop, sans-serif;
        }
        h1 {
            font-size: 24px;
        }
        input[type="text"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }
        input[type="number"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }
        button {
            background-color: rgba(254, 8, 16, 1);
            font-family: Shlop;
            font-size: 13px;
            color: white;
            border: 2px solid white;
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
        }
        p {
            font-size: 14px;
        }
    `;

    popupDocument.head.appendChild(styleElement);

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
        if (!isNaN(newMutedUserDuration)) {
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
    
    var popup = window.open('', '_blank', 'width=250,height=150,menubar=no,toolbar=no');
    if (!popup) {
        alert("Popup blocked. Please allow popups for this site.");
        return;
    }
    const popupDocument = popup.document;
    
    const styleElement = popupDocument.createElement("style");
    styleElement.textContent = `
        body {
            background-color: black;
            color: white;
            font-family: Shlop, sans-serif;
        }
        h1 {
            font-size: 24px;
        }
        input[type="text"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }
        button {
            background-color: rgba(254, 8, 16, 1);
            font-family: Shlop;
            font-size: 13px;
            color: white;
            border: 2px solid white;
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
        }
        p {
            font-size: 14px;
        }
    `;

    popupDocument.head.appendChild(styleElement);
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

export function addAdminPopUp(props:  &ChatProps, addAdminRights:(TargetName: string, chatName: ChatName) => void, currentChat: ChatData) {
    var popup = window.open('', '_blank', 'width=250,height=150,menubar=no,toolbar=no');
    if (!popup) {
        alert("Popup blocked. Please allow popups for this site.");
        return;
    }
    const popupDocument = popup.document;
    
    const styleElement = popupDocument.createElement("style");
    styleElement.textContent = `
        body {
            background-color: black;
            color: white;
            font-family: Shlop, sans-serif;
        }
        h1 {
            font-size: 24px;
        }
        input[type="text"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }
        button {
            background-color: rgba(254, 8, 16, 1);
            font-family: Shlop;
            font-size: 13px;
            color: white;
            border: 2px solid white;
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
        }
        p {
            font-size: 14px;
        }
    `;

    popupDocument.head.appendChild(styleElement);
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
        popup?.close();
    });
    popup?.document.body.appendChild(addAdminButton);

}

export function changePasswordPopUp(
    props:  &ChatProps,
    currentChat: ChatData,
    updateChannellist: () => void,
    changeChatRoom: (chatName: ChatName) => void) {
    var popup = window.open('', '_blank', 'width=250,height=200,menubar=no,toolbar=no');

    if (!popup) {
        alert("Popup blocked. Please allow popups for this site.");
        return;
    }

    const popupDocument = popup.document;
    
    const styleElement = popupDocument.createElement("style");
    styleElement.textContent = `
        body {
            background-color: black;
            color: white;
            font-family: Shlop, sans-serif;
        }
        h1 {
            font-size: 24px;
        }
        input[type="text"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }
        button {
            background-color: rgba(254, 8, 16, 1);
            font-family: Shlop;
            font-size: 13px;
            color: white;
            border: 2px solid white;
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
        }
        p {
            font-size: 14px;
        }
    `;

    popupDocument.head.appendChild(styleElement);

    const newPwLabel = document.createElement("h1");
    newPwLabel.textContent = "New Password:";
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
            // deleteChannelPassword(props?.userID, currentChat.Channel.ChannelId, props.user!)
            // .then(() => {
            //     changeChatRoom(currentChat.chatName);
            //     if (currentChat.Channel.Type === "private"){
            //         putChannelType(props?.userID, currentChat.Channel.ChannelId, props.user!)
            //         .then(() => {
            //             changeChatRoom(currentChat.chatName);
            //             updateChannellist();
            //         })
            //         .catch(error => {
            //         });
            //     }
            // })
            // .catch(error => {
            // });
            window.alert('You can not update the password to an empty one. Please use the "Remove Password" button instead')
        }
        else if (newPw.length > 15){
            window.alert('Passwort can not be longer than 15 characters');
        } else {
            putChannelPassword(props.userID, currentChat.Channel.ChannelId, newPw, props.user!)
            .then(() => {
                if (currentChat.Channel.Type === "public"){
                    putChannelType(props.userID, currentChat.Channel.ChannelId, props.user!)
                    .then(() => {
                        changeChatRoom(currentChat.chatName);
                        updateChannellist();
                    })
                    .catch(error => {
                    });
                }
            })
            .catch(error => {
            })
        }
        popup?.close();
    });
    popup?.document.body.appendChild(changePwButton);

    var removePwButton = document.createElement('button');
    removePwButton.innerHTML = 'Remove Password';
    removePwButton.addEventListener('click', function() {
        if (currentChat.Channel.Type === "private"){
            deleteChannelPassword(props.userID, currentChat.Channel.ChannelId, props.user!)
            .then(() => {
            if (currentChat.Channel.Type === "private"){
                putChannelType(props.userID, currentChat.Channel.ChannelId, props.user!)
                .then(() => {
                    changeChatRoom(currentChat.chatName);
                    updateChannellist();
                })
                .catch(error => {
                });
            }
            })
            .catch(error => {
            });
        } else {
            window.alert('The Channel is already public'); 
        }
        popup?.close();
    });
    popup?.document.body.appendChild(removePwButton);
}


export function popUpCreateChannel(
    props: ChatProps,
    updateChannellist: any,
    addChatRoom: (chatName: ChatName) => void
) {
    var popup = window.open('', '_blank', 'width=250,height=320,menubar=no,toolbar=no');

    if (!popup) {
        alert("Popup blocked. Please allow popups for this site.");
        return;
    }

    const popupDocument = popup.document;
    const styleElement = popupDocument.createElement("style");
    styleElement.textContent = `
        body {
            background-color: black;
            color: white;
            font-family: Shlop, sans-serif;
        }
        h1 {
            font-size: 24px;
        }
        input[type="text"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }
        button {
            background-color: rgba(254, 8, 16, 1);
            font-family: Shlop;
            font-size: 13px;
            color: white;
            border: 2px solid white;
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
        }
        p {
            font-size: 14px;
        }
    `;

    popupDocument.head.appendChild(styleElement);

    const channelNameLabel = popupDocument.createElement("h1");
    channelNameLabel.textContent = "Channel Name:";
    popupDocument.body.appendChild(channelNameLabel);

    var channelNameInput = popupDocument.createElement('input');
    channelNameInput.type = 'text';
    channelNameInput.placeholder = "Enter new Channel Name";
    popupDocument.body.appendChild(channelNameInput);

    const channelPasswordLabel = popupDocument.createElement("h1");
    channelPasswordLabel.textContent = "Channel Password:";
    popupDocument.body.appendChild(channelPasswordLabel);

    var channelPasswordInput = popupDocument.createElement('input');
    channelPasswordInput.type = 'text';
    channelPasswordInput.placeholder = "Password";
    popupDocument.body.appendChild(channelPasswordInput);
    
    const channelPasswordHint = popupDocument.createElement("p");
    channelPasswordHint.textContent = "(For public Channels, leave it empty)";
    popupDocument.body.appendChild(channelPasswordHint);

    var createButton = popupDocument.createElement('button');
    createButton.innerHTML = 'Create';
    createButton.addEventListener('click', function(e) {
        e.preventDefault();
        const channelName = channelNameInput.value;
        const password = channelPasswordInput.value;

        if (channelName.length < 1 || channelName.length > 15) {
            popup?.close();
            window.alert('Channel Name must be between 1 and 15 characters.');
        } else if( password.length > 15){
            popup?.close();
            window.alert('Passwort can not be longer than 15 characters');
        } else {
            CreateChannel(props, channelName, password)
                .then(result => {
                    if (result) {
                        addChatRoom(channelName);
                        updateChannellist();
                    }
                })
                .catch(error => {
                });
            popup?.close();
        }
    });
    popupDocument.body.appendChild(createButton);
}

  
export async function popUpJoinPrivateChannel(props: ChatProps, currentChat: ChatData ,joinPrivateRoom: (chatName: ChatName, password: string) => void){
    var popup = window.open('', '_blank', 'width=500,height=300,menubar=no,toolbar=no');
    if (!popup) {
        alert("Popup blocked. Please allow popups for this site.");
        return;
    }

    const popupDocument = popup.document;
    
    const styleElement = popupDocument.createElement("style");
    styleElement.textContent = `
        body {
            background-color: black;
            color: white;
            font-family: Shlop, sans-serif;
        }
        h1 {
            font-size: 24px;
        }
        input[type="text"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
        }
        button {
            background-color: rgba(254, 8, 16, 1);
            font-family: Shlop;
            font-size: 13px;
            color: white;
            border: 2px solid white;
            border-radius: 6px;
            padding: 5px 10px;
            cursor: pointer;
        }
        p {
            font-size: 14px;
        }
    `;

    popupDocument.head.appendChild(styleElement);

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
        if (password === '') {
            window.alert('Please enter a password');
        } else {
            joinPrivateRoom(currentChat.chatName, password);
        }
        popup?.close();
    });
    popup?.document.body.appendChild(createButton);
}
