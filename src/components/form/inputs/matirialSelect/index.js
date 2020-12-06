import React from "react";

const MatirialSelect = (props) => {
  const {
    name = "",
    value = "",
    options = [],
    placeholder = "",
    onChange = () => {},
    label = "",
  } = props;
  return (
    <fieldset className="material">
      <select
        className="form-control"
        options={options}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          outline: "none",
          scrollBehaviour: "smooth",
        }}
      >
        <option></option>
        {options &&
          options.length > 0 &&
          options.map((data) => {
            return <option value="value">{data}</option>;
          })}
      </select>
      {label && <label>{label}</label>}
    </fieldset>
  );
};
export default MatirialSelect;
