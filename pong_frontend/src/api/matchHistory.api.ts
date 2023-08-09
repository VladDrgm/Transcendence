export const getGlobalMatchHistory = async () => {
    const response = await fetch('http://localhost:3000/match');
    const json = (await response.json());
    return json;
};

export const getPersonalMatchHistory = async (userID:number) => {
    const response = await fetch('http://localhost:3000/match/' + userID + '/matchHistory');
    const json = (await response.json());
    return json;
};