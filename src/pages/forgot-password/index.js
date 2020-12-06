import React from "react";
import ForgotPassword from "../../components/form/forgotPassword/index.jsx";

export default () => {
  return (
    <div>
      <div className="acc-form-head">
        <h2 className="title">Forgot Password</h2>
        <p>Enter your email to set a new password</p>
      </div>
      <ForgotPassword />
    </div>
  );
};
