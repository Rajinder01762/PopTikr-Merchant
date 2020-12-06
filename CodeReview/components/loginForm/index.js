import { Link, useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { MatrialInput } from "../inputs";
import { Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import { apiCallPost } from "../../../common/api";
import { showErrorToast, showSuccessToast } from "../../../common/toaster";
import { setCookie, getCookie } from "../../../common/utils";
import validator from "validator";

const LoginForm = () => {
  const history = useHistory();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [isRemember, setRemember] = useState(false);
  useEffect(() => {
    const uname = getCookie("uname");
    const pwd = getCookie("pwd");
    if (uname && pwd) {
      setUsername(uname);
      setPassword(pwd);
      setRemember(true);
    }
  }, []);
  const isAdmin = location.pathname === "/admin/login";
  async function onLogin(e) {
    e.preventDefault();
    const error = {
      username: false,
      password: false,
    };
    if (!username || !validator.isEmail(username)) error.username = true;
    if (!password) error.password = true;

    setError(error);
    if (!error.username && !error.password) {
      const response = await apiCallPost(
        isAdmin ? "/admin/login" : "/merchantlogin",
        {
          email: username,
          password,
        }
      );
      if (response && response.success) {
        const { results } = response;
        if (isRemember) {
          setCookie("uname", username, 60);
          setCookie("pwd", password, 60);
        }
        localStorage.setItem("isAdmin", isAdmin);
        localStorage.setItem("token", results);
        setTimeout(() => window.location.reload(), 500);
        showSuccessToast(response.message);
        history.push(isAdmin ? "/profile" : "/dashboard");
      } else {
        showErrorToast(response.message);
      }
    }
  }

  return (
    <div className="login-form-wrapper">
      <form onSubmit={(e) => onLogin(e)}>
        <MatrialInput
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={error.username ? "Please enter a valid email" : ""}
        />

        <MatrialInput
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error.password ? "Password can not be empty" : ""}
        />

        <div className="d-flex justify-content-between align-items-center">
          <FormGroup check className="pl-0">
            <Label check>
              <Input
                checked={isRemember}
                onChange={() => setRemember(!isRemember)}
                type="checkbox"
              />{" "}
              Remember me
            </Label>
          </FormGroup>
          <Link to={isAdmin ? "/admin/forgot-password" : "/forgot-password"}>
            Forgot Password
          </Link>
        </div>

        <div className="mt-5">
          <Row>
            <Col>
              <Button
                type="submit"
                onClick={(e) => onLogin(e)}
                className="w-100"
                color="primary-black"
              >
                Login
              </Button>
            </Col>
            {!isAdmin && (
              <Col>
                <Button
                  className="w-100"
                  outline
                  onClick={() => history.push("/register")}
                >
                  Sign Up
                </Button>
              </Col>
            )}
          </Row>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
