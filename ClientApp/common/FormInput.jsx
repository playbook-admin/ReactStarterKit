import React from "react";

const FormInput = ({ text, type, placeholder, preText, onTextChanged, onEnter }) => {
  const handleChange = (e) => {
    onTextChanged(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
    onEnter();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'inline' }}>
      <label style={{ display: 'inline' }}>
        <strong>{preText}&nbsp;</strong>
        <input
          type={type}
          style={{ textAlign: "center" }}
          value={text}
          placeholder={placeholder}
          onChange={handleChange}
        />
      </label>
    </form>
  );
};

export default FormInput;
