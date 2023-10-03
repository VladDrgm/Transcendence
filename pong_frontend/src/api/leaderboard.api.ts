import { fetchAddress } from "../components/div/ChannelDiv";

export const getLeaderboard = async () => {
    const response = await fetch(fetchAddress + 'user/users/points');
    const json = (await response.json());
    return json;
  };