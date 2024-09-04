import React from "react";

const TextInput = ({ text, type, placeholder, preText, onTextChanged, onEnter }) => {
  const handleChange = (e) => {
    onTextChanged(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEnter();
    }
  };

  return (
    <div style={{ display: 'inline' }}>
      <strong>{preText}&nbsp;</strong>
      <input
        type={type}
        style={{ textAlign: "center" }}
        value={text}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TextInput;
