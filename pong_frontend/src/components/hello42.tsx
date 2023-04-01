// here we use the'getHello' from hello42.ts (in the api directory)
// we then create a 'component' -> a piece of front-end code that
// is a mixture of typescript and html (we can also add css to it for styling)
// and then we export this 'component' so that we may use it in our App.tsx

import React, { useState, useEffect } from 'react';
import { getHello } from '../api/hello42';

const Hello42 = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await getHello();
      setMessage(response);
    };
    fetchMessage();
  }, []);

  return <div>{message}</div>;
};

export default Hello42;
