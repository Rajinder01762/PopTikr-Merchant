import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Table from "../../components/tableComponents/table";
import SmartForm from "../../components/smartForm";
import {
  apiCallPost,
  apiCallPatch,
  apiCallGet,
  apiCallDelete,
} from "../../common/api";

const headers = [
  { selector: "name", sortable: true, name: "Name" },
  { selector: "email", sortable: true, name: "Email" },
  { selector: "phone", sortable: true, name: "Phone" },
  { selector: "status", sortable: true, name: "Status" },
];

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
    name: "email",
    label: "Email",
    type: "text",
    error: "Email address can't be blank",
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    error: "Phone can't be blank",
  },
  {
    name: "status",
    type: "select",
    placeholder: "Please select status",
    options: [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ],
    error: "Status is required",
  },
];

const ManageUsers = () => {
  const [seletedRow, setSelectedRow] = useState({});
  const [hotUpdate, setHotUpdate] = useState(false);
  const [errors, setErrors] = useState({
    first_name: false,
    last_name: false,
    email: false,
    phone: false,
    status: false,
  });
  async function hanldeSubmit(data, cb) {
    let info;
    const errorInfo = {};
    formFields.forEach((item) => {
      if (data[item.name] !== 0 && !data[item.name]) {
        errorInfo[item.name] = true;
      }
    });
    if (Object.keys(errorInfo).length > 0) return setErrors(errorInfo);
    if (data.id) {
      info = await apiCallPatch(`/admin/adminuser/${data.id}`, data, true);
    } else {
      info = await apiCallPost(`/admin/adminuser`, data, true);
    }
    if (info?.success) {
      cb();
      setHotUpdate(true);
      setSelectedRow({});
    }
  }
  async function handleDelete(id, cb) {
    const info = await apiCallDelete(`/admin/adminuser/${id}`, true);
    if (info?.success) {
      cb();
      setHotUpdate(true);
    }
  }

  return (
    <div className="form-column ">
      <Row>
        <Col lg={6} xl={6}>
          <SmartForm
            errors={errors}
            onSubmit={hanldeSubmit}
            data={seletedRow}
            formFields={formFields}
          />
        </Col>
        <Col lg={6} xl={6}>
          <Table
            handleEdit={async (data) => {
              const result = await apiCallGet(
                `/admin/adminuser/${data.id}`,
                false
              );
              setSelectedRow(result?.results || {});
            }}
            handleDelete={handleDelete}
            title="Manage Users"
            searchKey="search"
            listPath="/admin/adminuser"
            headers={headers}
            hotUpdate={hotUpdate}
            showDelete
            showEdit
          />
        </Col>
      </Row>
    </div>
  );
};

export default ManageUsers;
