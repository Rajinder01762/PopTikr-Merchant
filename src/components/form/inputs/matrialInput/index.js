import React, { useState } from "react";
import cx from "classnames";

const MatrialInput = (props) => {
  const {
    name = "",
    type = "text",
    label = "",
    placeholder = " ",
    onChange = () => {},
    value = "",
    error = "",
    isDisabled = false,
    success = "",
    maxLength = 1000,
    path = "",
    maxFileSize = 2,
    showType = true,
    contentType = "image/x-png,image/jpeg",
  } = props;
  const [isTypePassword, setIsTypePassword] = useState(type === "password");
  const inputsContainer = () => {
    return (
      <>
        <div
          className={cx("position-relative", { "mt-3": type === "textarea" })}
        >
          {type === "textarea" ? (
            <textarea
              type={
                type === "password" ? (isTypePassword ? type : "text") : type
              }
              name={name}
              disabled={isDisabled}
              placeholder={placeholder}
              autoComplete="false"
              value={value}
              maxLength={maxLength}
              onChange={onChange}
            />
          ) : type === "upload" ? (
            <div className="matrial-file file-icon upper-Pad">
              <label className={"light-border"}>
                <span className="m-text">
                  {value ? (
                    <a href={path} target="_blank" download>
                      {value}
                    </a>
                  ) : (
                    label
                  )}
                  <span className="l-text">
                    {" "}
                    (Max {maxFileSize}mb{showType ? " | JPG/PNG" : ""})
                  </span>
                </span>
                <input
                  disabled={isDisabled}
                  accept={contentType}
                  onChange={onChange}
                  name={name}
                  type="file"
                />
              </label>
            </div>
          ) : (
            <input
              type={
                type === "password" ? (isTypePassword ? type : "text") : type
              }
              name={name}
              min={0}
              disabled={isDisabled}
              maxLength={maxLength}
              placeholder={placeholder}
              autoComplete="false"
              value={value}
              onChange={onChange}
            />
          )}
          {label && type !== "upload" && <label>{label}</label>}
          {type === "password" && (
            <button
              type="button"
              disabled={isDisabled}
              className="pass-toggler"
              onClick={(e) => {
                e.preventDefault();
                setIsTypePassword((previous) => !previous);
              }}
            >
              <i className={`fas fa-eye${isTypePassword ? "-slash" : ""}`} />
            </button>
          )}
          {type !== "upload" && <hr />}
        </div>
        {error && <span className="text-danger form-error-text">{error}</span>}
        {success && (
          <span className="text-success form-error-text">{success}</span>
        )}
      </>
    );
  };

  const unWrappedInput = () => {
    return inputsContainer();
  };

  const wrappedInput = () => {
    return <fieldset className="material">{inputsContainer()}</fieldset>;
  };

  if (type === "upload") {
    return unWrappedInput();
  } else if (type !== "upload") {
    return wrappedInput();
  }
};

export default MatrialInput;
