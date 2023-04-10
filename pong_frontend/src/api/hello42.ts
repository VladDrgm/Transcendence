//we create a 'fetch' function that goes to the backend '/hello' url
// and then we export it so it can be used in a different function


export async function getHello(): Promise<string> {
	const response = await fetch('http://localhost:3000/hello');
	const message = await response.text();
	console.log(message);
	return message;
  }
  