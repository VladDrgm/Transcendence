import React, {useRef} from 'react';

function LogIn(userID_set : (id: number) => void) : any{
  const input_id = useRef();

  function saveUser_id() : void {
    userID_set(parseInt(input_id.current.value));
    input_id.current.value = null;
  };
  return (<div>
            <p>Login or create user.</p>
            <div>Id number:</div>
            <input ref={input_id} type="text" />
            <button onClick={saveUser_id}>Log In</button>
            <br />
            <button>Register</button>
          </div>);
};

export default LogIn;
