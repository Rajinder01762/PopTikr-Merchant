import React, { useState } from "react";
import { Link, withRouter, useLocation } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import { apiCallPost } from "../../../common/api";
import { MatrialInput } from "../inputs";

export function validateEmail(email) {
  let res = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const location = useLocation();
  const isAdmin = location.pathname === "/admin/forgot-password";
  async function onForgotPassword(e) {
    e.preventDefault();
    let error = {
      email: "",
    };
    if (!email) {
      error.email = "Email is required";
    }
    if (email && !validateEmail(email)) {
      error.email = "Enter a valid email";
    }
    setError(error);
    if (!error.email) {
      const obj = {
        email,
      };
      const response = await apiCallPost(
        isAdmin ? "/admin/forgotpassword" : "/merchantforgotpassword",
        obj,
        true
      );
      if (response && response.success) {
        props.history.push(isAdmin ? "/admin/login" : "/login");
      }
    }
  }
  return (
    <div className="login-form-wrapper">
      <form onSubmit={(e) => onForgotPassword(e)}>
        <MatrialInput
          label="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error.email || ""}
        />
        <div className="d-flex justify-content-center mb-3">
          <Button
            type="submit"
            onClick={(e) => onForgotPassword(e)}
            color="primary-black"
          >
            Send OTP
          </Button>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          Go to
          <Link className="ml-1" to={isAdmin ? "/admin/login" : "/login"}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default withRouter(ForgotPassword);
