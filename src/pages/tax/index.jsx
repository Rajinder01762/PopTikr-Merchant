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
  { selector: "tax_name", sortable: true, name: "Name" },
  { selector: "tax_code", sortable: true, name: "Code" },
  { selector: "tax_amount", sortable: true, name: "Amount" },
  { selector: "status", sortable: true, name: "Status" },
];

const formFields = [
  {
    name: "tax_name",
    label: "Tax Name",
    type: "text",
    error: "Tax name can't be blank",
  },
  {
    name: "tax_code",
    label: "Tax Code",
    type: "text",
    error: "Tax code can't be blank",
  },
  {
    name: "tax_amount",
    label: "Tax Amount",
    type: "number",
    error: "Tax amount can't be blank",
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

const ManageTax = () => {
  const [seletedRow, setSelectedRow] = useState({});
  const [hotUpdate, setHotUpdate] = useState(false);
  const [errors, setErrors] = useState({
    tax_name: false,
    tax_code: false,
    tax_amount: false,
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
      info = await apiCallPatch(`/admin/tax/${data.id}`, data, true);
    } else {
      info = await apiCallPost(`/admin/tax`, data, true);
    }
    if (info?.success) {
      cb();
      setHotUpdate(true);
      setSelectedRow({});
    }
  }
  async function handleDelete(id, cb) {
    const info = await apiCallDelete(`/admin/tax/${id}`, true);
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
              const result = await apiCallGet(`/admin/tax/${data.id}`, false);
              setSelectedRow(result?.results || {});
            }}
            handleDelete={handleDelete}
            title="Manage Tax"
            searchKey="tax_name"
            listPath="/admin/tax"
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

export default ManageTax;
