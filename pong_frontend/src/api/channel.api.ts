var fetchAddress = 'http://localhost:3000/';

export async function getChannels():  Promise<any[]> {
	const response = await fetch(fetchAddress + 'channel', {credentials: "include",});
  const json = await response.json();
	return json as any[];
}


export function postChannel(ChannelData: any) {
  console.log("ChannelData from post:", ChannelData);
  const requestOptions = {
    method: 'POST',
    headers: { "Container-Type": "application/json"},
    body:  JSON.stringify(ChannelData)  
  };
  fetch(fetchAddress + 'channel', requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log("Channel created:", data);
    })
    .catch(error => {
        console.log("Error creating channel:", error);
    });
}