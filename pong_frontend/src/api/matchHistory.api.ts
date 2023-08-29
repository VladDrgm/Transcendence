import { fetchAddress } from "../components/div/channel_div";

export const getGlobalMatchHistory = async () => {
    const response = await fetch(fetchAddress + 'match');
    const json = (await response.json());
    return json;
};

export const getPersonalMatchHistory = async (userID:number) => {
    const response = await fetch(fetchAddress + 'match/' + userID + '/matchHistory');
    const json = (await response.json());
    return json;
};