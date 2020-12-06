import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import Select from "react-select";
import axios from "axios";
import _ from "lodash";
import {
  apiCallGet,
  apiCallPost,
  apiCallUploadFile,
  backendUrl,
} from "../../../common/api";
import { showErrorToast } from "../../../common/toaster";
import {
  useAllCategories,
  useMerchantProfile,
  usePrograms,
} from "../../../common/apiHooks";
import { FormInfoTooltip } from "../../tooltip";
import { MatrialInput } from "../../form/inputs";
import {
  convertOptionsToValue,
  convertOptionToValue,
  getCustomOptions,
} from "../../../common/utils";
import InfoForm from "../../form/registerForm/infoForm/index";
import CovidForm from "../../form/registerForm/covidForm/index";
import {
  formatDetailsFormData,
  validateDetailsFormFields,
  validateForm,
} from "../../form/registerForm/helper";

const BasicDetails = () => {
  const [data, setData] = new useMerchantProfile();
  const categories = useAllCategories();
  const programs = usePrograms();
  const [detailsFormError, setDetailsFormError] = useState({});

  function onDetailsFormFieldChange(fieldname, value) {
    setData({ ...data, [fieldname]: value });
  }

  async function onUpdateProfileInfo(e) {
    const errors = validateDetailsFormFields(data, false);
    if (!data || Object.keys(data).length <= 0 || !validateForm(errors)) {
      setDetailsFormError(errors);
      return showErrorToast("Enter valid data");
    }
    const formattedObj = formatDetailsFormData(data, false);
    const response = await apiCallPost(
      "/updatemerchantprofile",
      formattedObj,
      true
    );
    response && response.success && setDetailsFormError({});
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize <= 10) {
        const formData = new FormData();
        formData.append("image", file);
        const link = await apiCallUploadFile(
          "/uploadmerchantlogo",
          formData,
          true
        );
        link && setData({ ...data, logo_path: link.filename });
      } else {
        showErrorToast("Maximum image size supported is 10MB");
      }
    }
  };

  return (
    <div className="profile-tab">
      <div className="logo-column">
        <div className="theme-card  mb-3 p-0">
          <img
            className="rounded"
            width="100%"
            height="100%"
            src={(data && data.logo_path) || ""}
            alt="Merchant Logo"
          />

          <div className="d-flex justify-content-end position-absolute align-self-end primary-black mb-2">
            <label for="avatar">
              <i class="fas fa-edit" />
            </label>
            <input
              className="hidden"
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg,image/jpg"
              onChange={(e) => handleLogoUpload(e)}
            />
          </div>
        </div>
        <p className="text-black text-center">Merchant Logo</p>
      </div>
      <div className="form-column">
        <Row
          className="d-flex just-items-center   justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <Col className="theme-card  d-flex align-items-center">
            <div className="w-100">
              <div className="register-form-wrapper">
                <div>
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
                  <div className="mt-3 mt-md-5 text-center mb-3">
                    <Button
                      color="primary-black"
                      onClick={(e) => onUpdateProfileInfo(e)}
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default withRouter(BasicDetails);
