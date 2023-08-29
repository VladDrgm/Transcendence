//we create a 'fetch' function that goes to the backend '/hello' url
// and then we export it so it can be used in a different function
import { fetchAddress } from "../components/div/channel_div";

export async function getHello(): Promise<string> {
	const response = await fetch(fetchAddress + 'hello');
	const message = await response.text();
	console.log(message);
	return message;
  }