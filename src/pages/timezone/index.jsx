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
  { selector: "tz_name", sortable: true, name: "Name" },
  { selector: "tz_code", sortable: true, name: "Code" },
  { selector: "status", sortable: true, name: "Status" },
];

const formFields = [
  {
    name: "tz_name",
    label: "Timezone Name",
    type: "text",
    error: "Timezone name can't be blank",
  },
  {
    name: "tz_code",
    label: "Timezone Code",
    type: "text",
    error: "Timezone code can't be blank",
  },
  {
    name: "status",
    type: "select",
    placeholder: "Please select status",
    options: [
      { value: 1, label: "Active" },
      { value: 0, label: "Inactive" },
    ],
    error: "Status is required",
  },
];

const ManageTimezone = () => {
  const [seletedRow, setSelectedRow] = useState({});
  const [hotUpdate, setHotUpdate] = useState(false);
  const [errors, setErrors] = useState({
    tz_name: false,
    tz_code: false,
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
      info = await apiCallPatch(`/admin/timezone/${data.id}`, data, true);
    } else {
      info = await apiCallPost(`/admin/timezone`, data, true);
    }
    if (info?.success) {
      cb();
      setHotUpdate(true);
      setSelectedRow({});
    }
  }
  async function handleDelete(id, cb) {
    const info = await apiCallDelete(`/admin/timezone/${id}`, true);
    if (info?.success) {
      cb();
      setHotUpdate(Math.random());
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
                `/admin/timezone/${data.id}`,
                false
              );
              setSelectedRow(result?.results || {});
            }}
            handleDelete={handleDelete}
            title="Manage Timezone"
            searchKey="tz_name"
            listPath="/admin/timezone"
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

export default ManageTimezone;
