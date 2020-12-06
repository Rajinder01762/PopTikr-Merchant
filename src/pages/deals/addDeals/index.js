import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { ReviewForm } from "../../../components/form";
import CouponReview from "./couponReview";
import { ReviewOrderModal } from "../../../components/modal";
import { apiCallGet, apiCallPost, apiCallPatch } from "../../../common/api";
import { showErrorToast } from "../../../common/toaster";
import classes from "./styles.module.scss";
import moment from "moment";

import {
  getFormattedData,
  validateFields,
  validateForm,
  formatTranslations,
} from "./helper";
import { useAppSettings } from "../../../common/apiHooks";

const AddDeals = ({ dealId, setDealId }) => {
  const [dealData, setDealData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [dealFormErrors, setDealFormErrors] = useState({});
  const [language, setLanaguage] = useState({ label: "English", value: "en" });
  const dealPrice = useAppSettings();
  useEffect(() => {
    dealId && getDealById();
  }, []);

  useEffect(() => {
    if (dealId) {
      getDealById();
    }
  }, [dealId]);

  async function getDealById() {
    const dealInfo = await apiCallGet(`/merchantcoupon/${dealId}`);
    if (dealInfo.results) {
      dealInfo.results.start_date = new Date(dealInfo.results.start_date);
      dealInfo.results.end_date = new Date(dealInfo.results.end_date);
      dealInfo.results.translations = formatTranslations(dealInfo.results);
      setDealData(dealInfo.results);
    } else {
      setDealId("");
    }
  }
  const isDisabled = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const isPast = moment(date).isAfter(moment(dealData.start_date));
    if (
      dealData.status === "Completed" ||
      isPast ||
      String(dealData.paymentstatus).toLowerCase() === "paid"
    ) {
      return true;
    }
    return false;
  };
  function isValid() {
    const errors = validateFields(dealData, language.value);
    if (!validateForm(errors)) {
      setDealFormErrors(errors);
      showErrorToast("Enter valid data");
      return false;
    }
    return true;
  }
  async function addOrUpdateDeal() {
    if (isValid()) {
      let dealInfo;
      const payload = getFormattedData(dealData, dealPrice);
      if (dealId) {
        dealInfo = await apiCallPatch(
          `/merchantcoupon/${dealId}`,
          payload,
          true
        );
      } else {
        dealInfo = await apiCallPost(`/merchantcoupon`, payload, true);
      }

      if (dealInfo?.deal_id) {
        setDealId();
      }
    }
  }

  const handleDealChange = (fieldName, value, isMulti = false) => {
    if (fieldName === "coupon_mode") {
      value === "Online" && delete dealData.coupon_location;
      value === "Nearby" && delete dealData.coupon_national;
    }
    if (isMulti) setDealData({ ...dealData, ...value });
    else setDealData({ ...dealData, [fieldName]: value });
  };
  const handleProceed = () => {
    if (isValid()) {
      setIsOpen(true);
    }
  };

  return (
    <div>
      <Row>
        <Col lg={6}>
          <div className={classes.cardWrapper}>
            <ReviewForm
              addOrUpdateDeal={addOrUpdateDeal}
              handleProceed={handleProceed}
              formErrors={dealFormErrors}
              dealData={dealData}
              isDisabled={isDisabled()}
              handleDealChange={handleDealChange}
              language={language}
              setLanaguage={setLanaguage}
            />
          </div>
        </Col>
        <Col lg={6}>
          <CouponReview
            language={language.value || "en"}
            className={classes.cardWrapper}
            dealData={dealData}
          />
        </Col>
      </Row>
      <ReviewOrderModal
        dealData={getFormattedData(dealData, dealPrice)}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
    </div>
  );
};

export default AddDeals;
