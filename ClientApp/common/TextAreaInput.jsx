import React from "react";
const TextAreaInput = (props) => {
  const handleChange = e => {
    props.onTextChanged(e.target.value);
  };

  return (
    <div style={{ display: 'inline' }}><strong>{props.preText}&nbsp;</strong>
      <textarea
        style={{ textAlign: "center" }}
        value={props.text}
        placeholder={props.placeholder}
        onChange={handleChange}>
      </textarea>
    </div>
  );
}

export default TextAreaInput