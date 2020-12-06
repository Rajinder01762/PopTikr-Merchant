import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { MatrialInput } from "../inputs";
import { Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import Select from "react-select";
import {
  apiCallGet,
  apiCallPost,
  apiCallUploadFile,
} from "../../../common/api";
import { showErrorToast } from "../../../common/toaster";
import { useAllCategories, usePrograms } from "../../../common/apiHooks";
import { FormInfoTooltip } from "../../tooltip";
import {
  formatDetailsFormData,
  validateDetailsFormFields,
  validateForm,
} from "./helper";
import InfoForm from "./infoForm/index";
import CovidForm from "./covidForm/index";

const RegisterForm = (props) => {
  const [data, setData] = useState({});
  const categories = useAllCategories();
  const programs = usePrograms();
  const [detailsFormError, setDetailsFormError] = useState({});

  function onDetailsFormFieldChange(fieldname, value) {
    setData({ ...data, [fieldname]: value });
  }

  async function onSignUp(e) {
    const errors = validateDetailsFormFields(data, true);
    if (!data || Object.keys(data).length <= 0 || !validateForm(errors)) {
      setDetailsFormError(errors);
      return showErrorToast("Enter valid data");
    }

    const obj = {
      ...data,
    };
    delete obj.agreeConditions;
    const formatObj = formatDetailsFormData(obj, true);
    const response = await apiCallPost("/addnewmerchant", formatObj, true);
    setDetailsFormError({});
    if (response && response.success) {
      const { history } = props;
      history.push("/");
    }
  }

  return (
    <div className="register-form-wrapper">
      <div>
        <p className="text-danger text-center no-padding">
          All fields are mandatory
        </p>

        <InfoForm
          data={data}
          setData={setData}
          categories={categories}
          onDetailsFormFieldChange={onDetailsFormFieldChange}
          detailsFormError={detailsFormError}
        />
        <CovidForm
          data={data}
          setData={setData}
          programs={programs}
          onDetailsFormFieldChange={onDetailsFormFieldChange}
          detailsFormError={detailsFormError}
        />
        <div className="form-wrapper">
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="agreeConditions"
                onChange={(e) => {
                  onDetailsFormFieldChange("agreeConditions", e.target.checked);
                }}
              />{" "}
              Yes,{" "}
              <Link to="/terms-conditions">I agree and authorize POP TikR</Link>{" "}
              to request and apply for the Program subsidy on my behalf. And
              upon verification, if my company does not qualify for the subsidy,
              I agree to be billed at the non-subsidized rate.
            </Label>
            {detailsFormError.agreeConditions && (
              <div className="text-danger">
                {detailsFormError.agreeConditions}
              </div>
            )}
          </FormGroup>
        </div>
        <div className="mt-3 mt-md-5 text-center mb-3">
          <Button color="primary-black" onClick={(e) => onSignUp(e)}>
            Sign Up
          </Button>
        </div>
        <div>
          <p className="text-center">
            Already have an account? <Link to="/">Sign in</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default withRouter(RegisterForm);
