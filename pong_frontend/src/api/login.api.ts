export async function login(userID:number)  { //placeholder for real login
    const response = await fetch('http://localhost:3000/user/login/' + userID, {credentials: 'include',});
    const setCookieHeader = await response.headers.get("Set-Cookie");
    if (setCookieHeader) {
      document.cookie = setCookieHeader;
    }
    console.log(response.text());
    console.log("Tried to log in as " + userID);
    }