import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import SmartForm from "../../smartForm";
import { apiCallGet, apiCallPost } from "../../../common/api";

const formFields = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    error: "First name can't be blank",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    error: "Last name can't be blank",
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    error: "Phone can't be blank",
  },
  {
    name: "email",
    label: "Email",
    disabled: true,
    type: "text",
    error: "Email can't be blank",
  },
];

export default () => {
  const [data, setData] = useState({});

  const [errors, setErrors] = useState({
    first_name: false,
    last_name: false,
    phone: false,
    email: false,
  });

  useEffect(() => {
    getAdminProfile();
  }, []);
  async function getAdminProfile() {
    const info = await apiCallGet(`/admin/getadminprofile`);
    info?.success && setData(info.results);
  }
  async function hanldeSubmit(data, cb) {
    const errorInfo = {};
    formFields.forEach((item) => {
      if (data[item.name] !== 0 && !data[item.name]) {
        errorInfo[item.name] = true;
      }
    });
    if (Object.keys(errorInfo).length > 0) return setErrors(errorInfo);
    const info = await apiCallPost(`/admin/updateadminprofile`, data, true);
    if (info?.success) {
      cb();
      getAdminProfile();
    }
  }

  return (
    <div className="form-column ">
      <Row>
        <Col lg={12} xl={12}>
          <SmartForm
            errors={errors}
            onSubmit={hanldeSubmit}
            data={data}
            formFields={formFields}
            forceUpdate={true}
            showReset={false}
            onlyUpdate
          />
        </Col>
      </Row>
    </div>
  );
};
