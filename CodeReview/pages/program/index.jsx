import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Table from "../../components/tableComponents/table";
import SmartForm from "../../components/smartForm";
import {
  apiCallDelete,
  apiCallGet,
  apiCallPatch,
  apiCallPost,
} from "../../common/api";

const headers = [
  { selector: "program_name", sortable: true, name: "Program Name" },
  { selector: "type_name", sortable: true, name: "Type" },
  { selector: "status", sortable: true, name: "Status" },
];

const formFields = [
  {
    name: "program_name",
    label: "Program Name",
    type: "text",
    error: "Program can't be blank",
  },
  {
    name: "details",
    label: "Details",
    type: "text",
    error: "Details can't be blank",
  },
  {
    name: "type",
    label: "Program Type",
    type: "text",
    error: "Type can't be blank",
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

const ManagePrograms = () => {
  const [seletedRow, setSelectedRow] = useState({});
  const [hotUpdate, setHotUpdate] = useState(false);
  const [errors, setErrors] = useState({
    program_name: false,
    details: false,
    type: false,
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
      info = await apiCallPatch(`/admin/programs/${data.id}`, data, true);
    } else {
      info = await apiCallPost(`/admin/programs`, data, true);
    }
    if (info?.success) {
      cb();
      setHotUpdate(true);
      setSelectedRow({});
    }
  }
  async function handleDelete(id, cb) {
    const info = await apiCallDelete(`/admin/programs/${id}`, true);
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
            title="Manage Programs"
            searchKey="program_name"
            listPath="/admin/programs"
            headers={headers}
            handleEdit={async (data) => {
              const result = await apiCallGet(
                `/admin/programs/${data.id}`,
                false
              );
              setSelectedRow(result?.results || {});
            }}
            handleDelete={handleDelete}
            hotUpdate={hotUpdate}
            showDelete
            showEdit
          />
        </Col>
      </Row>
    </div>
  );
};

export default ManagePrograms;
