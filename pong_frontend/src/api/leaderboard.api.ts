export const getLeaderboard = async () => {
    const response = await fetch('http://localhost:3000/user/users/points');
    const json = (await response.json());
    return json;
  };