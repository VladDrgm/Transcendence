import { putOwner } from '../../api/channel/channel_owner.api';
import { ChatProps } from '../../interfaces/channel.interface';
import { getUserIDByUserName } from './channel_utils';

export async function changeOwner(newOwnerUsername: string, props: &ChatProps){
    //finding right UserId to the Username input from addAdminPopUp
    var targetID = await getUserIDByUserName(newOwnerUsername);
    // retrieving UserID from getUserID(UserName) from backend maybe
    if (targetID)//changing the 1 to props.yourId or the real UserID of the caller
        {
            putOwner(props.currentChat.Channel.ChannelId, Number(targetID));
            console.log('Owner changed to UserId:', targetID);
    } else 
    console.error('Error changing Owner with Username:' , newOwnerUsername);
}
