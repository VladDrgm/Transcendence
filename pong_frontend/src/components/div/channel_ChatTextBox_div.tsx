import React, { KeyboardEvent } from 'react';

interface ChatTextBoxProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  // placeholder: string;
  isUserMuted: boolean;
}

const ChatTextBox: React.FC<ChatTextBoxProps> = ({
  value,
  onChange,
  onKeyPress,
  // placeholder,
  isUserMuted
}) => {
  if (isUserMuted){
    return (
      <textarea
			value={undefined}
			onChange = {undefined}
			onKeyPress={undefined}
			placeholder="You are muted in this chat"
			/>
    )
  }
  return (
    <textarea
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="You can write something here"
    />
  );
};

export default ChatTextBox;
