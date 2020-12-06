import React, { useEffect, useState } from "react";
import { Link, useLocation, withRouter } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import { apiCallPost } from "../../../common/api";
import { showErrorToast } from "../../../common/toaster";
import { MatrialInput } from "../inputs";
import { useHistory } from "react-router-dom";

const ResetPassword = () => {
  const [data, setData] = useState({});
  const [resetPasswordErrors, setResetPasswordErrors] = useState({});
  const history = useHistory();
  const location = useLocation();
  const isAdmin = location.pathname === "/admin/reset-password";
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const otp = urlParams.get("otp");
    if (otp) {
      onChangeField("otp", otp);
    } else {
      showErrorToast("Invalid url");
      // history.push("/login");
    }
  }, []);

  function validateForm(errors) {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  }

  function validateResetPasswordFields(data) {
    let errors = {};
    if (!data["newPassword"]) {
      errors.newPassword = "New password is required";
    }
    if (!data["confirmPassword"]) {
      errors.confirmPassword = "Confirm password is required";
    }
    if (
      data["newPassword"] &&
      data["confirmPassword"] &&
      data["newPassword"].localeCompare(data["confirmPassword"])
    ) {
      errors.confirmPassword = "Password does not match";
    }
    return errors;
  }

  async function onResetPassword(e) {
    e.preventDefault();
    const errors = validateResetPasswordFields(data);
    if (!data || Object.keys(data).length <= 0 || !validateForm(errors)) {
      setResetPasswordErrors(errors);
      return showErrorToast("Enter valid data");
    }
    const obj = {
      code: data.otp || "",
      new_password: data.newPassword || "",
      confirm_password: data.confirmPassword || "",
    };
    const response = await apiCallPost(
      isAdmin ? "/admin/updatenewpassword" : "/merchantupdatenewpassword",
      obj,
      true
    );
    if (response && response.success) {
      setData({});
      history.push(isAdmin ? "/admin/login" : "/login");
    }
  }

  function onChangeField(fieldname, fieldvalue) {
    setData({ ...data, [fieldname]: fieldvalue });
  }
  return (
    <div className="login-form-wrapper">
      <form onSubmit={(e) => onResetPassword(e)}>
        {/* <MatrialInput
          label="OTP"
          name="otp"
          value={data["otp"]}
          onChange={(e) => onChangeField("otp", e.target.value)}
          error={resetPasswordErrors.otp || ""}
        /> */}
        <MatrialInput
          type="password"
          label="newPassword"
          name="newPassword"
          value={data["newPassword"]}
          onChange={(e) => onChangeField("newPassword", e.target.value)}
          error={resetPasswordErrors.newPassword || ""}
        />
        <MatrialInput
          type="password"
          label="confirmPassword"
          name="confirmPassword"
          value={data["confirmPassword"]}
          onChange={(e) => onChangeField("confirmPassword", e.target.value)}
          error={resetPasswordErrors.confirmPassword || ""}
        />
        <div className="mt-5">
          <div className="d-flex justify-content-center">
            <Button
              type="submit"
              color="primary-black"
              onClick={(e) => onResetPassword(e)}
            >
              Set new password
            </Button>
          </div>
          <div className=" mt-2 d-flex justify-content-center align-items-center">
            Go to
            <Link className="ml-1" to={isAdmin ? "/admin/login" : "/login"}>
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withRouter(ResetPassword);
