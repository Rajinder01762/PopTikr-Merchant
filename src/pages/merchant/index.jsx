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
import { useEffect } from "react";

const headers = [
  { selector: "first_name", sortable: true, name: "First Name" },
  { selector: "last_name", sortable: true, name: "Last Name" },
  { selector: "email", sortable: true, name: "Email" },
];

const formFields = (programs, categories = []) => [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    error: "First Name can't be blank",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    error: "Last Name can't be blank",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    error: "Email can't be blank",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    error: "Phone Number can't be blank",
  },
  {
    name: "company_name",
    label: "Company Name",
    type: "text",
    error: "Company Name can't be blank",
  },
  {
    name: "bn_number",
    label: "BN Number",
    type: "text",
    error: "BN Number can't be blank",
  },
  {
    name: "program_id",
    label: "Program",
    type: "select",
    placeholder: "Please select program",
    options: programs.map((item) => ({
      value: item.id,
      label: item.program_name,
    })),
    error: "Program is required",
  },
  {
    name: "category_id",
    label: "Categories",
    id: "id",
    optionLabel: "category_name",
    type: "multi-select",
    placeholder: "Please select categorie(s)",
    options: categories,
    error: "Categorie(s) is required",
  },
  {
    name: "document_file",
    label: "Upload Business Verifcation document (Max 10MB)",
    type: "upload",
    error: "Please upload document",
    showType: false,
    path: "document_file_path",
    mediaType: "document",
    contentType: "application/msword,  application/pdf,.doc, .docx",
    maxFileSize: 10,
    uploadUrl: "/admin/uploadmerchantdocument",
    previewUrl: "http://3.96.52.131:3001/merchantdocument/",
  },
  {
    name: "made_in",
    type: "made_in",
  },
];

// {

//   "category_id": [
//     "string"
//   ],

export default () => {
  const [seletedRow, setSelectedRow] = useState({});
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);

  const [hotUpdate, setHotUpdate] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    getOptions();
  }, []);

  async function getOptions() {
    const apiInfo = await apiCallGet("/admin/programs");
    setPrograms(apiInfo?.results?.data || []);
    const apiInfoCate = await apiCallGet("/admin/category");
    setCategories(apiInfoCate?.results?.data || []);
  }
  async function hanldeSubmit(data, cb) {
    let info;
    const errorInfo = {};
    formFields(programs, categories).forEach((item) => {
      if (
        data[item.name] !== 0 &&
        !data[item.name] &&
        item.name !== "made_in"
      ) {
        errorInfo[item.name] = true;
      }
    });
    delete data.document_file_path;
    if (Object.keys(errorInfo).length > 0) return setErrors(errorInfo);
    if (data.id) {
      const updateId = data.id;
      delete data.id;
      delete data.logo_path;
      delete data.program_name;
      info = await apiCallPatch(`/admin/merchant/${updateId}`, data, true);
    } else {
      info = await apiCallPost(`/admin/merchant`, data, true);
    }
    if (info?.success) {
      cb();
      setHotUpdate(true);
      setSelectedRow({});
    }
  }
  async function handleDelete(id, cb) {
    const info = await apiCallDelete(`/admin/merchant/${id}`, true);
    if (info?.success) {
      cb();
      setHotUpdate(Math.random());
    }
  }

  async function handleSwitch(id) {
    await apiCallPost(`/admin/activatemerchantaccount`, { id }, true);
  }

  return (
    <div className="form-column ">
      <Row>
        <Col lg={6} xl={6}>
          <SmartForm
            errors={errors}
            onSubmit={hanldeSubmit}
            data={seletedRow}
            formFields={formFields(programs, categories)}
          />
        </Col>
        <Col lg={6} xl={6}>
          <Table
            title="Manage Merchants"
            searchKey="search"
            listPath="/admin/merchant"
            headers={headers}
            handleEdit={async (data) => {
              const result = await apiCallGet(
                `/admin/merchant/${data.id}`,
                false
              );
              setSelectedRow(result?.results || {});
            }}
            handleDelete={handleDelete}
            hotUpdate={hotUpdate}
            handleSwitch={handleSwitch}
            showDelete
            showEdit
            showSwitch
          />
        </Col>
      </Row>
    </div>
  );
};
