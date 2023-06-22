export const getLeaderboard = async () => {
    const response = await fetch('http://localhost:3000/api/leaderboard');
    const json = (await response.json());
    return json;
  };