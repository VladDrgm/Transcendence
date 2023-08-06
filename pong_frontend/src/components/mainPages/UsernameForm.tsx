import React, { ChangeEvent } from "react";

interface FormProps {
  username: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  connect: () => void;
}

const Form: React.FC<FormProps> = (props) => {
  return (
    <form>
      <input
        placeholder="Username"
        type="text"
        value={props.username}
        onChange={props.onChange}
      />
      <button onClick={props.connect}>Connect</button>
    </form>
  );
};

export default Form;