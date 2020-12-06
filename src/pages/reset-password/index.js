import React from "react";
import ResetPassword from "../../components/form/resetPassword/index";

export default () => {
  return (
    <div>
      <div className="acc-form-head">
        <h2 className="title">Set a new Password</h2>
        <p>Enter your otp to set a new password</p>
      </div>
      <ResetPassword />
    </div>
  );
};
