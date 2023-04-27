import React, {useRef} from 'react';

interface LogInProps
{
  userID_set: React.Dispatch<React.SetStateAction<number>>;
  loginDone_set: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogIn: React.FC<LogInProps> = ({userID_set, loginDone_set}) => {
  const input_id = useRef<HTMLInputElement>(null);

  function saveUser_id() : void {
    if (input_id.current != null)
    {
      const parsedInput = parseInt(input_id.current.value);
      if (!isNaN(parsedInput))
      {
        userID_set(parseInt(input_id.current.value));
        loginDone_set(true);
      }
      input_id.current.value = '';
    }
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
