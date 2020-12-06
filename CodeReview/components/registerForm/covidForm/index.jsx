import React from "react";
import { Row, Col, Button, FormGroup, Label, Input } from "reactstrap";
import Select from "react-select";
import { FormInfoTooltip } from "../../../tooltip";
import { MatrialInput } from "../../inputs";
import { showErrorToast } from "../../../../common/toaster";
import { apiCallUploadFile } from "../../../../common/api";
import { convertOptionToValue } from "../../../../common/utils";
import _ from "lodash";

const CovidForm = (props) => {
  const {
    data,
    programs = [],
    onDetailsFormFieldChange,
    detailsFormError,
  } = props;
  async function onHandleFileChange(evt) {
    const file = evt.target.files && evt.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize <= 10) {
        const formData = new FormData();
        formData.append("document", file);
        const link = await apiCallUploadFile(
          "/uploadmerchantdocument",
          formData,
          true
        );

        link && onDetailsFormFieldChange("document_file", link.filename);
      } else {
        showErrorToast("Select a valid document");
      }
    }
  }

  return (
    <div className="form-wrapper bg-primary-light ">
      <p className="text-center text-primary-black">
        To apply and qualify for the COVID-19 Economic Recovery subsidy program
        for eligible SMEs, please fill-out the information below
      </p>
      <div className="position-relative">
        <Select
          className="my-3"
          classNamePrefix="matrail-select"
          options={programs.map((item) => ({
            label: item.program_name,
            value: item.id,
          }))}
          value={
            data && data["program_id"] && _.head(programs)
              ? {
                  value: data["program_id"] || "",
                  label: programs.find((item) => item.id === data["program_id"])
                    .program_name,
                }
              : ""
          }
          placeholder="Select Subsidy Program"
          onChange={(item) => {
            onDetailsFormFieldChange("program_id", convertOptionToValue(item));
          }}
        />
        <FormInfoTooltip placement="left" tooltipText="Lorem Ipsume" />
        {detailsFormError.program_id && (
          <div className="text-danger form-error-text">
            {detailsFormError.program_id}
          </div>
        )}
        <MatrialInput
          label="BN Number"
          name="bn_number"
          value={data ? data["bn_number"] : ""}
          onChange={(e) =>
            onDetailsFormFieldChange(e.target.name, e.target.value)
          }
        />
        <FormInfoTooltip placement="left" tooltipText="Lorem Ipsume" />
        {detailsFormError.bn_number && (
          <div className="text-danger form-error-text">
            {detailsFormError.bn_number}
          </div>
        )}
      </div>
      <div className="pt-3">
        <div className="matrial-file mt-0 cloud-icon">
          <form encType="multipart/form-data">
            <label>
              <span>
                {data && data.document_file ? (
                  <a href={data.document_file_path} target="_blank" download>
                    {" "}
                    {data.document_file}
                  </a>
                ) : (
                  "Upload Business Verifcation document (Max 10MB)"
                )}
              </span>
              <input
                accept="application/msword,  application/pdf,.doc, .docx"
                type="file"
                value={data ? data["file"] : ""}
                onChange={(e) => onHandleFileChange(e)}
              />
            </label>
          </form>
          <FormInfoTooltip placement="left" tooltipText="Lorem Ipsume" />
        </div>
        {detailsFormError.document_file && (
          <div className="text-danger form-error-text">
            {detailsFormError.document_file}
          </div>
        )}
      </div>
      <div>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={data && data.made_in === "Canada" ? true : false}
              onChange={(e) => {
                onDetailsFormFieldChange(
                  "made_in",
                  e.target.checked ? "Canada" : ""
                );
              }}
            />{" "}
            Shop owned and operated in Canada
          </Label>
        </FormGroup>
      </div>
    </div>
  );
};

export default CovidForm;
