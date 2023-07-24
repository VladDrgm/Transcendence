import { postAdmin } from '../../api/channel/channel_admin.api';
import { ChatProps } from '../../interfaces/channel.interface';
import { fetchAddress } from './channel_div';
import { getUserIDByUserName } from './channel_utils';

export async function addOwner(newOwnerUsername: string, props: &ChatProps){
    //finding right UserId to the Username input from addAdminPopUp
    var targetID = await getUserIDByUserName(newOwnerUsername);
    // retrieving UserID from getUserID(UserName) from backend maybe
    if (targetID)//changing the 1 to props.yourId or the real UserID of the caller
        {
            postAdmin(props.currentChat.Channel.ChannelId, Number(targetID), props.userID);
            console.log('Admin added with UserId:', targetID);
    } else 
    console.error('Error adding Admin with Username:' , newOwnerUsername);
}
