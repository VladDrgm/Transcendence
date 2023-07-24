import { Dispatch, SetStateAction } from 'react';
import { Channel, ChatProps } from '../../interfaces/channel.interface';
import { modBannedUser, addAdmin, joinPrivateChannel, CreateChannel, addMuteUser} from './channel_utils';
import { postChannelUser, postMuteUser } from '../../api/channel/channel_user.api';

export function banUserPopUp(props: &ChatProps) {
    
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
}

export function muteUserPopUp(props: &ChatProps) {
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
        addMuteUser(newMutedUserName, newMutedUserDuration, props);
        popup?.close();
    });
    popup?.document.body.appendChild(addMuteButton)
}

export function kickUserPopUp(props: &ChatProps) {
    
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


export function popUpCreateChannel(props: ChatProps){
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

        CreateChannel(props, channelName, password);
        popup?.close();
    });
    popup?.document.body.appendChild(createButton);
}

export async function popUpJoinPrivateChannel(setPrivateChannels:  Dispatch<SetStateAction<Channel[]>>){
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
