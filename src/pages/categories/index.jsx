import React, { useEffect, useState } from "react";
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
  { selector: "category_name", sortable: true, name: "Category Name" },
  { selector: "color_code", sortable: true, name: "Color Code" },
  { selector: "status", sortable: true, name: "Status" },
];

const formFields = [
  {
    name: "translations",
    label: "Select Language",
    placeholder: "Select Language",
    type: "select",
    error: "Language can't be blank",
    isLanguageSelect: true,
  },
  {
    name: "category_name",
    label: "Category Name",
    type: "text",
    error: "Category name can't be blank",
    isLangBased: true,
  },
  {
    name: "color_code",
    label: "Color Code,  example: (#123456)",
    type: "text",
    error: "Color code can't be blank",
  },
  {
    name: "category_image",
    label: "Upload Category Image",
    type: "upload",
    error: "Category image can't be blank",
    path: "category_image_path",
    uploadUrl: "/admin/uploadcategoryimage",
    previewUrl: "http://3.96.52.131:3001/category/",
  },
  {
    name: "category_image_alt",
    label: "Upload Category Alternate Image",
    type: "upload",
    error: "Category alternate image can't be blank",
    path: "category_image_alt_path",
    uploadUrl: "/admin/uploadcategoryimage",
    previewUrl: "http://3.96.52.131:3001/category/",
  },
  {
    name: "marker_icon",
    label: "Upload Marker Image",
    type: "upload",
    error: "Marker image can't be blank",
    path: "marker_icon_path",
    uploadUrl: "/admin/uploadcategorymarkerimage",
    previewUrl: "http://3.96.52.131:3001/categorymarker/",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Please select status",
    options: [
      { value: 1, label: "Active" },
      { value: 0, label: "Inactive" },
    ],
    error: "Status is required",
  },
];

const Categories = () => {
  const [seletedRow, setSelectedRow] = useState({});
  const [hotUpdate, setHotUpdate] = useState(false);

  const errorData = {
    category_name: false,
    color_code: false,
    category_image: false,
    marker_icon: false,
    status: false,
  };
  const [errors, setErrors] = useState(errorData);
  async function hanldeSubmit(formData, cb) {
    let info;
    setErrors(errorData);
    const errorInfo = {};
    const data = { ...formData, ...formData.translations.en };
    delete data.marker_icon_path;
    delete data.category_image_path;
    delete data.category_image_alt_path;
    const colorRegex = RegExp(/#([a-f0-9]{3}){1,2}\b/i);
    formFields.forEach((item) => {
      if (data[item.name] !== 0 && !data[item.name]) {
        errorInfo[item.name] = true;
      }
      if (item.name === "color_code" && !colorRegex.test(data[item.name])) {
        errorInfo[item.name] = "Invalid color code";
      }
    });
    if (Object.keys(errorInfo).length > 0) return setErrors(errorInfo);
    if (data.id) {
      info = await apiCallPatch(`/admin/category/${data.id}`, data, true);
    } else {
      info = await apiCallPost(`/admin/category/`, data, true);
    }
    if (info?.success) {
      cb();
      setHotUpdate(Math.random());
    }
  }
  async function handleDelete(id, cb) {
    const info = await apiCallDelete(`/admin/category/${id}`, true);
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
                `/admin/category/${data.id}`,
                false
              );
              setSelectedRow(result?.results || {});
            }}
            handleDelete={handleDelete}
            title="Manage Categories"
            searchKey="category_name"
            listPath="/admin/category"
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

export default Categories;
