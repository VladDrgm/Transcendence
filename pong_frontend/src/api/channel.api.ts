var fetchAddress = 'http://localhost:3000/';

export async function getChannels():  Promise<any[]> {
	const response = await fetch(fetchAddress + 'channel', {credentials: "include",});
  const json = await response.json();
	return json as any[];
  }
