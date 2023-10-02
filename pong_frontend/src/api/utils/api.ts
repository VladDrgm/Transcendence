const fetchAddress = `${process.env.REACT_APP_BASE_URL}`;

interface FetchConfig extends RequestInit {
	headers?: {
	  [key: string]: string;
	};
	body?: any;
  }
  
  export async function api<T = any>(
	endpoint: string,
	{ body, ...customConfig }: FetchConfig = {}
  ): Promise<T> {
	const headers = { 'Content-Type': 'application/json' };
  
	const config: FetchConfig = {
	  method: body ? 'POST' : 'GET',
	  ...customConfig,
	  headers: {
		...headers,
		...customConfig.headers,
	  },
	};
  
	if (body) {
	  config.body = JSON.stringify(body);
	}
  
	const response = await fetch(`${fetchAddress}${endpoint}`, config);
	const data = await response.json();
  
	if (response.ok) {
	  return data;
	} else {
	  throw new Error(data.message || 'Something went wrong!');
	}
  }