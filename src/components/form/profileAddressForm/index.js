import React, { useEffect, useState } from "react";
import { Button, Row, Col, Input, FormGroup, Label } from "reactstrap";
import { MatrialInput } from "../inputs";
import Select from "react-select";
import cx from "classnames";
import { apiCallGet, apiCallPost, apiCallPatch } from "../../../common/api";
import { timeHours, shopStatus, timeMinutes, weeks } from "./constant";
import {
  convertOptionsToValue,
  convertValueToOption,
  getCustomOptions,
} from "../../../common/utils";
import { showErrorToast } from "../../../common/toaster";
import {
  validateLocationFields,
  validateLocationForm,
  formatLocationData,
} from "./helper";
import {
  useCategories,
  useMerchantTimeZone,
  useTaxList,
} from "../../../common/apiHooks";

const ProfileAddressForm = ({ locationId, setForceRefresh, forceRefresh }) => {
  const [locationData, setLocationData] = useState({});
  const merchantTimeZone = useMerchantTimeZone();
  const categories = useCategories();
  const taxList = useTaxList();
  const [selectedWeek, setSelectedWeek] = useState("su");
  const [profileErrors, setProfileErrors] = useState({});

  useEffect(() => {
    locationId && getLocationInfoById();
  }, [locationId]);

  const handleTimeInfoChange = (name, value) => {
    setLocationData({
      ...locationData,
      [`working_time_${selectedWeek}`]: {
        ...locationData[`working_time_${selectedWeek}`],
        [name]: value,
      },
    });
  };

  async function getLocationInfoById() {
    const response = await apiCallGet(`/merchantlocation/${locationId}`);
    if (response && response.success && response.results) {
      const formatted = formatLocationData(response.results);
      setLocationData(formatted);
    }
  }

  function onHandleChange(fieldname, fieldvalue) {
    setLocationData({ ...locationData, [fieldname]: fieldvalue });
  }

  async function onAddLoction() {
    const errors = validateLocationFields(locationData, selectedWeek);
    if (!validateLocationForm(errors)) {
      setProfileErrors(errors);
      return showErrorToast("Enter valid data");
    }
    const formatted = formatLocationData(locationData);
    let response;
    if (locationId) {
      response = await apiCallPatch(
        `/merchantlocation/${locationId}`,
        formatted,
        true
      );
    } else {
      response = await apiCallPost("/merchantlocation", formatted, true);
    }
    if (response.success) {
      setLocationData({});
      setSelectedWeek("");
      setForceRefresh(!forceRefresh);
    }
  }

  return (
    <div>
      <div className="theme-card mb-4 profile-loaction-form">
        <MatrialInput
          label="Location Name"
          name="location_name"
          value={locationData["location_name"] || ""}
          onChange={(e) => onHandleChange(e.target.name, e.target.value)}
          error={profileErrors.location_name}
        />

        <Select
          className="mb-3"
          classNamePrefix="matrail-select"
          value={
            locationData["tax_id"]
              ? {
                  value: locationData["tax_id"],
                  label: taxList.find(
                    (item) => item.id === locationData["tax_id"]
                  ).tax_name,
                }
              : null
          }
          options={
            taxList &&
            taxList.map((data) => ({
              label: data.tax_name,
              value: data.id,
            }))
          }
          name="tax_id"
          onChange={(option) => onHandleChange("tax_id", option.value)}
          placeholder="Select Provision"
        />
        {profileErrors.tax_id && (
          <div className="text-danger form-error-text">
            {profileErrors.tax_id}
          </div>
        )}
        <MatrialInput
          label="Address"
          name="address"
          value={locationData["address"] || ""}
          onChange={(e) => onHandleChange(e.target.name, e.target.value)}
          error={profileErrors.address}
        />

        <Row>
          <Col md={6}>
            <MatrialInput
              label="Latitude"
              name="lat"
              value={locationData["lat"] || ""}
              error={profileErrors.lat}
              onChange={(e) => onHandleChange(e.target.name, e.target.value)}
            />
          </Col>
          <Col md={6}>
            <MatrialInput
              label="Longtitude"
              name="lng"
              error={profileErrors.lng}
              value={locationData["lng"] || ""}
              onChange={(e) => onHandleChange(e.target.name, e.target.value)}
            />
          </Col>
        </Row>
        <Select
          className="mb-3"
          classNamePrefix="matrail-select"
          value={
            locationData["timezone"]
              ? {
                  value: locationData["timezone"],
                  label: merchantTimeZone.find(
                    (item) => item.id === locationData["timezone"]
                  ).tz_name,
                }
              : null
          }
          options={
            merchantTimeZone &&
            merchantTimeZone.map((data) => ({
              label: data.tz_name,
              value: data.id,
            }))
          }
          name="timezone"
          onChange={(option) => onHandleChange("timezone", option.value)}
          placeholder="Time Zone"
        />
        {profileErrors.timezone && (
          <div className="text-danger form-error-text">
            {profileErrors.timezone}
          </div>
        )}

        <Row>
          <Col md={6}>
            <MatrialInput
              label="Website"
              name="website"
              error={profileErrors.website}
              value={locationData ? locationData["website"] : ""}
              onChange={(e) => onHandleChange(e.target.name, e.target.value)}
            />
          </Col>
          <Col md={6}>
            <MatrialInput
              label="Phone"
              name="phone"
              error={profileErrors.phone}
              value={locationData ? locationData["phone"] : ""}
              onChange={(e) => onHandleChange(e.target.name, e.target.value)}
            />
          </Col>
        </Row>
        <Select
          className="mb-3"
          classNamePrefix="matrail-select"
          options={
            categories &&
            categories.map((item) => ({
              label: item.category_name,
              value: item.category_id,
            }))
          }
          value={getCustomOptions(
            locationData.category_id,
            categories,
            "category_id",
            "category_name"
          )}
          isMulti
          name="category_id"
          onChange={(options) =>
            onHandleChange("category_id", convertOptionsToValue(options))
          }
          placeholder="Select Category (Select Multiple)"
        />
        {profileErrors.category_id && (
          <div className="text-danger form-error-text">
            {profileErrors.category_id}
          </div>
        )}
        <div className="working-hours">
          <div>
            <p className="pr-2">Shop Working Hours</p>
          </div>
          <div>
            <ul className="pagination">
              {weeks.map(({ week }, index) => {
                const active = week === selectedWeek;
                return (
                  <li key={index} className={cx("page-item", { active })}>
                    <button
                      onClick={() => {
                        setSelectedWeek(week);
                      }}
                      class="page-link low-z-index rounded-0"
                    >
                      {`${week.toUpperCase()}`}
                    </button>
                  </li>
                );
              })}
            </ul>
            {profileErrors.selectedWeek && (
              <span className="text-danger form-error-text">
                Please select a week
              </span>
            )}
            <Select
              className="mb-3"
              classNamePrefix="matrail-select"
              value={convertValueToOption(
                locationData[`working_time_${selectedWeek}`]
                  ? locationData[`working_time_${selectedWeek}`].status
                  : ""
              )}
              onChange={(option) =>
                handleTimeInfoChange("status", option.value)
              }
              options={shopStatus}
              name="status"
              placeholder="Shop Status"
            />
            {profileErrors && profileErrors.status && (
              <div className="text-danger form-error-text">
                {profileErrors.status}
              </div>
            )}

            <div className="time">
              <div className="time-select mb-3">
                <div>
                  <p className="mb-0">Open Time</p>
                </div>
                <div className="time-select-dropdown">
                  <Select
                    classNamePrefix="matrail-select"
                    options={timeHours}
                    placeholder="00"
                    name="opentime_hh"
                    value={convertValueToOption(
                      locationData[`working_time_${selectedWeek}`]
                        ? locationData[`working_time_${selectedWeek}`]
                            .opentime_hh
                        : ""
                    )}
                    onChange={(option) => {
                      handleTimeInfoChange("opentime_hh", option.label);
                    }}
                  />
                  <Select
                    classNamePrefix="matrail-select"
                    options={timeMinutes}
                    name={"opentime_mm"}
                    placeholder="00"
                    value={convertValueToOption(
                      locationData[`working_time_${selectedWeek}`]
                        ? locationData[`working_time_${selectedWeek}`]
                            .opentime_mm
                        : ""
                    )}
                    onChange={(option) =>
                      handleTimeInfoChange("opentime_mm", option.label)
                    }
                  />
                </div>
                {profileErrors.openHours && (
                  <div className="text-danger form-error-text">
                    {profileErrors.openHours}
                  </div>
                )}
              </div>
              <div className="time-select mb-3">
                <div>
                  <p className="mb-0">Close Time</p>
                </div>
                <div className="time-select-dropdown">
                  <Select
                    classNamePrefix="matrail-select"
                    options={timeHours}
                    placeholder="00"
                    name="closetime_hh"
                    value={convertValueToOption(
                      locationData[`working_time_${selectedWeek}`]
                        ? locationData[`working_time_${selectedWeek}`]
                            .closetime_hh
                        : ""
                    )}
                    onChange={(option) => {
                      handleTimeInfoChange("closetime_hh", option.label);
                    }}
                  />
                  <Select
                    classNamePrefix="matrail-select"
                    options={timeMinutes}
                    placeholder="00"
                    name="closetime_mm"
                    value={convertValueToOption(
                      locationData[`working_time_${selectedWeek}`]
                        ? locationData[`working_time_${selectedWeek}`]
                            .closetime_mm
                        : ""
                    )}
                    onChange={(option) => {
                      handleTimeInfoChange("closetime_mm", option.label);
                    }}
                  />
                </div>
                {profileErrors.closeHours && (
                  <div className="text-danger form-error-text">
                    {profileErrors.closeHours}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <FormGroup check>
          <Label check>
            <Input
              name="is_primary"
              type="checkbox"
              value={locationData["is_primary"] || ""}
              onChange={(e) =>
                onHandleChange("is_primary", e.target.checked ? 1 : 0)
              }
            />{" "}
            Set as primary location
          </Label>
        </FormGroup>
      </div>
      <div className="d-flex justify-content-between">
        <Button color="primary-black" onClick={() => onAddLoction()}>
          Continue
        </Button>
        <button
          className="btn bg-white"
          onClick={() => {
            setLocationData({});
            setSelectedWeek("");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProfileAddressForm;
