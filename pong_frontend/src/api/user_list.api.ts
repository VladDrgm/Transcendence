import { fetchAddress } from "../components/div/ChannelDiv";

export const getUserList = async () => {
    const response = await fetch(fetchAddress + 'user');
    const json = (await response.json());
    return json;
  };