import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { apiCallPost } from "../../../common/api";
import { showErrorToast } from "../../../common/toaster";
import { MatrialInput } from "../../form/inputs";

const ChangePassword = () => {
  const [data, setData] = useState({});
  const [changePassError, setChangePassError] = useState({});
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  function validateForm(errors) {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  }

  function validateChangePassFields(data) {
    let errors = {};
    if (!data["current_password"]) {
      errors.current_password = "Current password is required";
    }
    if (!data["new_password"]) {
      errors.new_password = "New password is required";
    }
    if (!data["confirm_password"]) {
      errors.confirm_password = "Confirm password is required";
    }
    return errors;
  }

  async function onChangePassword(e) {
    e.preventDefault();
    const errors = validateChangePassFields(data);
    if (!data || Object.keys(data).length <= 0 || !validateForm(errors)) {
      setChangePassError(errors);
      return showErrorToast("Enter valid data");
    }
    const obj = {
      current_password: data.current_password || "",
      new_password: data.new_password || "",
      confirm_password: data.confirm_password || "",
    };

    const response = await apiCallPost(
      isAdmin ? "/admin/updatepassword" : "/updatemerchantpassword",
      obj,
      true
    );
    if (response && response.success) {
      setData({});
      setChangePassError({});
    }
  }

  function onHandleInputChange(fieldname, fieldvalue) {
    setData({ ...data, [fieldname]: fieldvalue });
  }

  return (
    <div className="container  theme-card form-column">
      <form>
        <MatrialInput
          type="password"
          name="current_password"
          label="Current Password"
          value={data["current_password"]}
          onChange={(e) => onHandleInputChange(e.target.name, e.target.value)}
          error={changePassError.current_password}
        />
        <MatrialInput
          type="password"
          name="new_password"
          label="New Password"
          value={data["new_password"]}
          onChange={(e) => onHandleInputChange(e.target.name, e.target.value)}
          error={changePassError.new_password}
        />
        <MatrialInput
          type="password"
          name="confirm_password"
          label="Confirm Password"
          value={data["confirm_password"]}
          onChange={(e) => onHandleInputChange(e.target.name, e.target.value)}
          error={changePassError.confirm_password}
        />
        <div className="mt-5">
          <div className="d-flex justify-content-center">
            <Button
              type="submit"
              color="primary-black"
              onClick={(e) => onChangePassword(e)}
            >
              Change Password
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ChangePassword;
