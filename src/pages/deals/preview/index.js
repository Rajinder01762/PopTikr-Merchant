import React from "react";
import arrowIcon from "../../../assets/images/icons/arrow-left.svg";
import heartIcon from "../../../assets/images/icons/heart.svg";
import shareIcon from "../../../assets/images/icons/share.svg";
import callIcon from "../../../assets/images/icons/call.svg";
import timeIcon from "../../../assets/images/icons/time.svg";
import directionIcon from "../../../assets/images/icons/direction.svg";
import webIcon from "../../../assets/images/icons/web.svg";
import arrowUp from "../../../assets/images/icons/arrow-line-up.svg";
import moment from "moment";
import flag from "./flag.png";
import _ from "lodash";
import { useCategories, useMerchantProfile } from "../../../common/apiHooks";
import { backendUrl } from "../../../common/api";

const Preview = ({ dealData, language }) => {
  const categories = useCategories();
  const [profile = {}] = useMerchantProfile();
  const getLangName = (name) => {
    return `translations.${language}.${name}`;
  };
  const Head = () => (
    <div className="head">
      <div>
        <img src={arrowIcon} alt="back" className="mr-3" />
        Offer Details
      </div>
      <div>
        <img src={heartIcon} alt="wishlist" className="mr-3" />
        <img src={shareIcon} alt="wishlist" />
      </div>
    </div>
  );
  const InfoLinks = () => {
    const linksData = [
      { name: "Call", icon: callIcon },
      { name: "Closed Now", icon: timeIcon },
      { name: "Get Directions", icon: directionIcon },
      { name: "Website", icon: webIcon },
    ];
    return (
      <div className="info-links">
        <ul>
          {linksData.map(({ name, icon }, index) => (
            <li key={index}>
              <img src={icon} alt={name} />
              {name}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  const InfoHead = () => (
    <div className="info-head">
      <div className="d-flex justify-content-between up">
        <div className="brand">
          <img width={40} src={profile.logo_path || ""} alt="No Logo" />
          <p className="mb-0">{_.get(dealData, getLangName("title"), "")}</p>
        </div>
        <div className="brandinfo">
          <p className="mb-0">{profile.company_name || ""}</p>
          <p className="sm">
            {getCategoryNames(categories, dealData.coupon_category) || ""}{" "}
          </p>
        </div>
      </div>
      <InfoLinks />
    </div>
  );
  const Description = () => {
    const description = _.get(dealData, getLangName("description"), "");
    return (
      <div className="text-content">
        <p className="i-title d-flex justify-content-between">
          Description <img src={arrowUp} alt="arow" />
        </p>
        <ul className="m-0">
          {description.split("\n").map((txt) => (
            <li>
              <span>•</span>
              {txt}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const BottomSection = () => (
    <div className="bottom-section">
      <div className="bottom-section-content">
        <p className="text">
          <b>Your Redeem Now</b> button will become activated once you reach
          location<span>•</span>
          Then simply tap and the promo code will be made available to you.
        </p>
      </div>
      <div className="btn-wrapper">
        <p className="btn-text reedem">REDEEM NOW</p>
        <p className="btn-text wallet">SAVE TO WALLET</p>
      </div>
    </div>
  );
  return (
    <div className="row">
      <div className="image-detail-preview">
        <div className="image-card">
          <div className="main-image">
            <img src={dealData.logo_path || ""} alt="NA" />
          </div>
          <div className="logo-wrapper">
            <img src={profile.logo_path || ""} alt="NA" />
          </div>
          <div className="actions">
            <img src={heartIcon} alt="wishlist" />
            <img src={shareIcon} alt="wishlist" />
          </div>
          <img className="flag" src={flag} alt="logo" />
        </div>
        <div className="content-wrapper">
          <div className="content">
            <p className="text">{_.get(dealData, getLangName("title"), "")}</p>
          </div>
          <div className=" bottom d-flex align-items-center justify-content-between">
            <span className="date">
              Valid till{" "}
              {dealData.end_date
                ? moment(dealData.end_date).format("DD MMM YYYY")
                : ""}
            </span>
            <span className="offer">View Offer</span>
          </div>
        </div>
      </div>
      <div className="detail-preview mx-auto">
        <Head />
        <InfoHead />
        <div className="content-part">
          <div className="scroll-part">
            <Description />
          </div>
          <hr className="seprator" />
          <Disclaimer
            showDefault={false}
            data={_.get(dealData, getLangName("fine_print"), "")}
            title="Fine Print"
          />
          <hr className="seprator" />
          <Disclaimer showDefault={true} data={null} title="Disclaimer" />
          <BottomSection />
        </div>
      </div>
    </div>
  );
};
const Disclaimer = ({ title, data, showDefault }) => (
  <div className="text-content">
    <p className="i-title">{title}</p>
    <p className="i-text">
      {!showDefault && data}
      {showDefault &&
        `POP TikR shall neither be liable nor responsible for any actions or
      inactions of Vendors and/or Sellers or any breach of conditions,
      representations or warranties by the Vendor or manufacturer of the
      products.`}
    </p>
  </div>
);

function getCategoryNames(categories, selected) {
  const name = [];
  if (categories && selected && categories.length && selected.length) {
    selected.forEach((id) => {
      const ct = categories.find((item) => item.category_id === id);
      if (ct) {
        name.push(ct.category_name);
      }
    });
  }
  return name.join(",");
}
export default Preview;
