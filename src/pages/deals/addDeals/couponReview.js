import React from "react";
import cx from "classnames";
import Preview from "../preview";

const CouponReview = ({ dealData, language, className = "" }) => {
  return (
    <div className={cx("d-flex flex-column", className)}>
      <div className="theme-card flex-grow-1 detail-card">
        <p className="w-100 mb-2 text-center">COUPON PREVIEW</p>
        <Preview language={language} dealData={dealData} />
      </div>
    </div>
  );
};

export default CouponReview;
