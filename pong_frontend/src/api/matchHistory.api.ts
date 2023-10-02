import { fetchAddress } from "../components/div/ChannelDiv";

export const getGlobalMatchHistory = async (userID:number, intra:string | undefined, token:string | undefined) => {
    const response = await fetch(fetchAddress + 'match/' + userID + "/all", {
		method: "PUT",
		headers: {
		  "Content-Type": "application/json"
		},
		body:  JSON.stringify({
			"intraUsername" : intra,
			"passwordHash" : token
		})
	  });
    const json = (await response.json());
    return json;
};

export const getPersonalMatchHistory = async (userID:number, intra:string | undefined, token:string | undefined) => {
    const response = await fetch(fetchAddress + 'match/' + userID + "/" + userID + '/matchHistory', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body:  JSON.stringify({
        "intraUsername" : intra,
        "passwordHash" : token
    })
    });
    const json = (await response.json());
    return json;
};