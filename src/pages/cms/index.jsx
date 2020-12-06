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
  { selector: "page_code", sortable: true, name: "Page Code" },
  { selector: "title", sortable: true, name: "Title" },
  { selector: "status", sortable: true, name: "Status" },
];

const formFields = [
  //   {
  //     name: "platform",
  //     label: "Platform Name",
  //     type: "text",
  //     error: "Platform can't be blank",
  //   },
  //   {
  //     name: "page_code",
  //     label: "Page Code",
  //     type: "text",
  //     error: "Page Code can't be blank",
  //   },
  {
    name: "title",
    label: "Title",
    type: "text",
    error: "Title can't be blank",
  },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    error: "Content can't be blank",
  },
  //   {
  //     name: "status",
  //     type: "select",
  //     placeholder: "Please select status",
  //     options: [
  //       { value: 1, label: "Active" },
  //       { value: 0, label: "Inactive" },
  //     ],
  //     error: "Status is required",
  //   },
];

export default () => {
  const [seletedRow, setSelectedRow] = useState({});
  const [hotUpdate, setHotUpdate] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    content: false,
  });
  async function hanldeSubmit(data, cb) {
    const errorInfo = {};
    formFields.forEach((item) => {
      if (data[item.name] !== 0 && !data[item.name]) {
        errorInfo[item.name] = true;
      }
    });
    if (Object.keys(errorInfo).length > 0) return setErrors(errorInfo);
    const info = await apiCallPatch(
      `/admin/cms/${data.id}`,
      { title: data.title, content: data.content },
      true
    );
    if (info?.success) {
      cb();
      setHotUpdate(Math.random());
      setSelectedRow({});
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
            onlyUpdate
          />
        </Col>
        <Col lg={6} xl={6}>
          <Table
            title="Manage CMS"
            searchKey="title"
            listPath="/admin/cms"
            headers={headers}
            handleEdit={async (data) => {
              const result = await apiCallGet(`/admin/cms/${data.id}`, false);
              setSelectedRow(result?.results || {});
            }}
            hotUpdate={hotUpdate}
            showDelete={false}
            showEdit
          />
        </Col>
      </Row>
    </div>
  );
};
