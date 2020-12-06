import React, { useState } from "react";
import { Button, Row, Col, Input, FormGroup, Label } from "reactstrap";
import DatePicker from "react-datepicker";
import { MatrialInput } from "../inputs";
import Select from "react-select";
import { apiCallUploadFile, apiCallPatchFile } from "../../../common/api";
import moment from "moment";
import {
  convertOptionsToValue,
  randomCoupenCode,
  getCustomOptions,
} from "../../../common/utils";
import {
  useCategories,
  useLanguages,
  useNationals,
  useMerchantLocations,
} from "../../../common/apiHooks";
import { showErrorToast } from "../../../common/toaster";
import _ from "lodash";
import CropModal from "./CropModal";

const ReviewForm = ({
  dealData,
  handleDealChange,
  formErrors,
  addOrUpdateDeal,
  handleProceed,
  language,
  setLanaguage,
  isDisabled,
}) => {
  const categories = useCategories();
  const locations = useMerchantLocations();
  const languages = useLanguages();
  const nationals = useNationals();
  const [src, setSource] = useState();
  const [isOpen, setModal] = useState(false);
  const toggle = () => setModal(!isOpen);

  const lang = language.value || "en";
  const getLangName = (name) => {
    return `translations.${lang}.${name}`;
  };
  const setTranslationValue = (evt) => {
    const langData =
      dealData.translations && Object.keys(dealData.translations).length
        ? dealData.translations
        : {};
    const subData = Object.keys(langData).length > 0 ? langData[lang] : {};
    handleDealChange("translations", {
      ...langData,
      [lang]: {
        ...subData,
        [evt.target.name]: evt.target.value,
      },
    });
  };

  async function handleLogoUpload(blob) {
    const fileInfo = new File([blob], "croped.jpeg", {
      lastModified: new Date(),
      type: "image/jpeg",
    });
    const formData = new FormData();
    formData.append("image", fileInfo);
    let link = await apiCallUploadFile("/uploadcouponimage", formData, true);
    toggle();
    if (link) {
      handleDealChange(
        "logo",
        { logo: link.filename, logo_path: link.couponimage },
        true
      );
    }
  }
  return (
    <div>
      <div className="theme-card detail-card">
        <CropModal
          handleLogoUpload={handleLogoUpload}
          toggle={toggle}
          isOpen={isOpen}
          src={src}
        />
        <Select
          className="mb-3"
          classNamePrefix="matrail-select"
          isDisabled={isDisabled}
          options={
            languages
              ? languages.map((item) => ({
                  label: item.lang_title,
                  value: item.lang_code,
                }))
              : []
          }
          value={language}
          placeholder="Select Language"
          name="language"
          onChange={(option) => setLanaguage(option)}
        />
        <Row>
          <Col sm={6}>
            <div className="my-3">
              <DatePicker
                disabled={isDisabled}
                minDate={moment().toDate()}
                name="start_date"
                placeholderText="Promo Start Date"
                className="w-100"
                selected={dealData.start_date}
                onChange={(date) => handleDealChange("start_date", date)}
              />
              <span className="text-danger form-error-text">
                {formErrors.start_date || ""}
              </span>
            </div>
          </Col>
          <Col sm={6}>
            <div className="my-3">
              <DatePicker
                disabled={isDisabled}
                minDate={moment().toDate()}
                name="end_date"
                placeholderText="Promo End Date"
                className="w-100"
                selected={dealData.end_date}
                onChange={(date) => handleDealChange("end_date", date)}
              />
              <span className="text-danger form-error-text">
                {formErrors.end_date || ""}
              </span>
            </div>
          </Col>
        </Row>
        <MatrialInput
          isDisabled={isDisabled}
          onChange={setTranslationValue}
          value={_.get(dealData, getLangName("deal_name"))}
          name={"deal_name"}
          label="Deal Name"
          error={formErrors.deal_name}
        />

        <MatrialInput
          isDisabled={isDisabled}
          label={
            <>
              Coupon Title <span>(Maximum 25 characters)</span>{" "}
            </>
          }
          maxLength={25}
          onChange={setTranslationValue}
          value={_.get(dealData, getLangName("title"))}
          name={"title"}
          error={formErrors.title}
        />
        <MatrialInput
          isDisabled={isDisabled}
          onChange={setTranslationValue}
          value={_.get(dealData, getLangName("description"))}
          name={"description"}
          type="textarea"
          maxLength={650}
          label={
            <>
              Description <span>(Maximum 650 characters)</span>
            </>
          }
          error={formErrors.description}
        />

        <MatrialInput
          isDisabled={isDisabled}
          onChange={setTranslationValue}
          value={_.get(dealData, getLangName("fine_print"))}
          name={"fine_print"}
          type="textarea"
          maxLength={200}
          label={
            <>
              Fine Print <span>(Maximum 200 characters)</span>{" "}
            </>
          }
          error={formErrors.fine_print}
        />
        <div className="matrial-file file-icon">
          <label>
            <span>
              {dealData.logo ? (
                <a href={dealData.logo_path} target="_blank" download>
                  {dealData.logo}
                </a>
              ) : (
                "Upload Coupon Image"
              )}
              <span className="l-text">(Max 2mb | 102x72 px | JPG/PNG) </span>
            </span>
            <input
              disabled={isDisabled}
              accept="image/x-png,image/jpeg"
              onChange={(evt) => {
                const file = evt.target.files && evt.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  //Read the contents of Image File.
                  reader.readAsDataURL(file);
                  reader.onload = function (e) {
                    setSource(e.target.result);
                    toggle();
                  };
                }
              }}
              name="logo"
              type="file"
            />
          </label>
          {formErrors.logo && (
            <span className="text-danger form-error-text">
              {formErrors.logo}
            </span>
          )}
        </div>
        <Row form>
          <Col lg={12} xl={6}>
            <div className="my-3">
              <Select
                isDisabled={isDisabled}
                classNamePrefix="matrail-select"
                options={
                  categories
                    ? categories.map((item) => ({
                        label: item.category_name,
                        value: item.category_id,
                      }))
                    : []
                }
                value={getCustomOptions(
                  dealData.coupon_category,
                  categories,
                  "category_id",
                  "category_name"
                )}
                isMulti
                name="coupon_category"
                onChange={(options) =>
                  handleDealChange(
                    "coupon_category",
                    convertOptionsToValue(options)
                  )
                }
                placeholder="Select Coupon Category"
              />
              {formErrors.coupon_category && (
                <span className="text-danger form-error-text">
                  {formErrors.coupon_category}
                </span>
              )}
            </div>
          </Col>

          <Col lg={12} xl={6}>
            <MatrialInput
              isDisabled={isDisabled}
              type="number"
              label={
                <>
                  {" "}
                  No of Coupons <span>(Optional)</span>
                </>
              }
              value={dealData.quantity}
              name="quantity"
              error={formErrors.quantity}
              onChange={(evt) =>
                handleDealChange(evt.target.name, evt.target.value)
              }
            />
          </Col>
        </Row>
        <div className="d-flex mb-3">
          <span className="pr-2">Select Offer Type</span>
          <div className="d-flex">
            <FormGroup check className="mr-2">
              <Label check>
                <Input
                  disabled={isDisabled}
                  onChange={(evt) => {
                    handleDealChange("coupon_national", []);
                    handleDealChange(evt.target.name, "Nearby");
                  }}
                  checked={dealData.coupon_mode === "Nearby"}
                  name="coupon_mode"
                  type="radio"
                  className="mr-2"
                />
                Nearby
              </Label>
            </FormGroup>
            <FormGroup check className="mr-2">
              <Label check>
                <Input
                  disabled={isDisabled}
                  onChange={(evt) => {
                    handleDealChange("coupon_location", []);
                    handleDealChange(evt.target.name, "Online");
                  }}
                  checked={dealData.coupon_mode === "Online"}
                  name="coupon_mode"
                  type="radio"
                  className="mr-2"
                />
                Online
              </Label>
            </FormGroup>
            <FormGroup check className="mr-2">
              <Label check>
                <Input
                  disabled={isDisabled}
                  onChange={(evt) => handleDealChange(evt.target.name, "Both")}
                  checked={dealData.coupon_mode === "Both"}
                  name="coupon_mode"
                  type="radio"
                  className="mr-2"
                />
                Both
              </Label>
            </FormGroup>
            {formErrors.coupon_mode && (
              <span className="text-danger form-error-text">
                {formErrors.coupon_mode}
              </span>
            )}
          </div>
        </div>
        {!(!dealData.coupon_mode || dealData.coupon_mode === "Nearby") && (
          <div className="my-3">
            <Select
              isDisabled={isDisabled}
              classNamePrefix="matrail-select"
              options={
                nationals &&
                nationals.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))
              }
              name="coupon_national"
              placeholder="Select National(s)"
              isMulti
              value={getCustomOptions(
                dealData.coupon_national,
                nationals,
                "id",
                "name"
              )}
              onChange={(options) => {
                handleDealChange(
                  "coupon_national",
                  convertOptionsToValue(options)
                );
              }}
            />
            {formErrors.coupon_national && (
              <span className="text-danger form-error-text">
                {formErrors.coupon_national}
              </span>
            )}
          </div>
        )}
        {!(!dealData.coupon_mode || dealData.coupon_mode === "Online") && (
          <div className="my-3">
            <Select
              isDisabled={isDisabled}
              classNamePrefix="matrail-select"
              options={
                locations
                  ? locations.map((item) => ({
                      label: item.address,
                      value: item.location_id,
                    }))
                  : []
              }
              name="coupon_location"
              placeholder="Select Location(s)"
              isMulti
              value={getCustomOptions(
                dealData.coupon_location,
                locations,
                "location_id",
                "address"
              )}
              onChange={(options) => {
                handleDealChange(
                  "coupon_location",
                  convertOptionsToValue(options)
                );
              }}
            />
            {formErrors.coupon_location && (
              <span className="text-danger form-error-text">
                {formErrors.coupon_location}
              </span>
            )}
          </div>
        )}

        {/* <FormGroup check>
          <Label check>
            <Input
              onChange={(evt) =>
                handleDealChange(evt.target.name, !dealData.all_location)
              }
              checked={Boolean(dealData.all_location)}
              name="all_location"
              type="checkbox"
            />{" "}
            Use same coupon for all locations
          </Label>
          {formErrors.all_location && (
            <span className="text-danger form-error-text">
              {formErrors.all_location}
            </span>
          )}
        </FormGroup> */}

        <div className="d-flex align-items-center">
          <div className="flex-grow-1 pr-1">
            <MatrialInput
              isDisabled={isDisabled}
              onChange={(evt) =>
                handleDealChange(evt.target.name, evt.target.value)
              }
              value={dealData.coupon_code}
              label="Coupon Code"
              name="coupon_code"
              maxLength={10}
              error={formErrors.coupon_code}
            />
          </div>
          <Button
            disabled={isDisabled}
            size="sm"
            color="primary-black"
            onClick={() => handleDealChange("coupon_code", randomCoupenCode(6))}
          >
            Generate
          </Button>
        </div>
      </div>
      <div className="text-center d-flex justify-content-around">
        <Button
          disabled={isDisabled}
          onClick={() => addOrUpdateDeal()}
          color="primary-white"
          className="text-uppercase"
        >
          Save Coupon
        </Button>

        <Button
          disabled={isDisabled}
          onClick={handleProceed}
          color="primary-white"
          className="text-uppercase"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
