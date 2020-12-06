import React from "react";
import { LoginForm } from "../../components/form";

export default () => (
  <div>
    <div className="acc-form-head">
      <h2 className="title">Login</h2>
      <p>Welcome back! Please login to your account</p>
    </div>
    <LoginForm />
  </div>
);
