import { fetchAddress } from "../components/div/channel_div";

export const getUserList = async () => {
    const response = await fetch(fetchAddress + 'user');
    const json = (await response.json());
    return json;
  };