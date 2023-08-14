export const getUserList = async () => {
    const response = await fetch('http://localhost:3000/user');
    const json = (await response.json());
    return json;
  };