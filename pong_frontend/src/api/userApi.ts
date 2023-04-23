export const getUsers = async () => {
  const response = await fetch('http://localhost:3000/api/users');
  const json = (await response.json());
  return json;
};