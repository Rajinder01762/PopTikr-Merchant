import React from "react";
import { Row, Col } from "reactstrap";
import Select from "react-select";
import { MatrialInput } from "../../inputs";
import {
  convertOptionsToValue,
  getCustomOptions,
} from "../../../../common/utils";
import _ from "lodash";
const InfoForm = (props) => {
  const {
    data,
    categories,
    onDetailsFormFieldChange,
    detailsFormError,
  } = props;
  return (
    <div className="form-wrapper">
      <Row form>
        <Col md={6}>
          <MatrialInput
            label="Company Name"
            name="company_name"
            value={data ? data["company_name"] : ""}
            onChange={(e) =>
              onDetailsFormFieldChange(e.target.name, e.target.value)
            }
          />
          {detailsFormError.company_name && (
            <div className="text-danger form-error-text">
              {detailsFormError.company_name}
            </div>
          )}
        </Col>
        <Col md={6}>
          <Select
            className="my-3"
            classNamePrefix="matrail-select"
            options={
              _.head(categories)
                ? categories.map((item) => ({
                    label: item.category_name,
                    value: item.category_id,
                  }))
                : []
            }
            placeholder="Select Category"
            name="category_id"
            isMulti
            value={getCustomOptions(
              data ? data["category_id"] : "",
              categories,
              "category_id",
              "category_name"
            )}
            onChange={(options) => {
              onDetailsFormFieldChange(
                "category_id",
                convertOptionsToValue(options)
              );
            }}
          />
          {detailsFormError.category_id && (
            <div className="text-danger form-error-text">
              {detailsFormError.category_id}
            </div>
          )}
        </Col>
        <Col md={6}>
          <MatrialInput
            label="First Name"
            name="first_name"
            value={data ? data["first_name"] : ""}
            onChange={(e) =>
              onDetailsFormFieldChange(e.target.name, e.target.value)
            }
          />
          {detailsFormError.first_name && (
            <div className="text-danger form-error-text">
              {detailsFormError.first_name}
            </div>
          )}
        </Col>
        <Col md={6}>
          <MatrialInput
            label="Last Name"
            name="last_name"
            value={data ? data["last_name"] : ""}
            onChange={(e) =>
              onDetailsFormFieldChange(e.target.name, e.target.value)
            }
          />
          {detailsFormError.last_name && (
            <div className="text-danger form-error-text">
              {detailsFormError.last_name}
            </div>
          )}
        </Col>
        <Col md={6}>
          <MatrialInput
            label="Email"
            name="email"
            value={data ? data["email"] : ""}
            onChange={(e) =>
              onDetailsFormFieldChange(e.target.name, e.target.value)
            }
          />
          {detailsFormError.email && (
            <div className="text-danger form-error-text">
              {detailsFormError.email}
            </div>
          )}
        </Col>
        <Col md={6}>
          <MatrialInput
            type="tel"
            label="Telephone Number"
            name="phone"
            value={data ? data["phone"] : ""}
            onChange={(e) =>
              onDetailsFormFieldChange(e.target.name, e.target.value)
            }
          />
          {detailsFormError.phone && (
            <div className="text-danger form-error-text">
              {detailsFormError.phone}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};
export default InfoForm;
