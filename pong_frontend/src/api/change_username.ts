import { fetchAddress } from "../components/div/channel_div";
// var fetchAddress = 'http://localhost:3000/';

export const changeUsername = async (userID:number, username:string) => {
  	const response = await fetch(fetchAddress + "user/" + userID + "/update/username/" + username, {method:'PUT'});
};