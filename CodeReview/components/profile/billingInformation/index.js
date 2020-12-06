import React from "react";
import { BillingInformationForm } from "../../../components/form";
import { useMerchantProfile } from "../../../common/apiHooks";

const BillingInformation = () => {
  const [profile] = useMerchantProfile();

  return (
    <div className="profile-tab">
      <div className="logo-column">
        <div className="theme-card  mb-3 p-0">
          <img
            className="rounded"
            width="100%"
            height="100%"
            src={profile ? profile.logo_path : ""}
            alt="Merchant Logo"
          />
        </div>
        <p className="text-black text-center">Merchant Logo</p>
      </div>
      <div className="form-column">
        <BillingInformationForm />
      </div>
    </div>
  );
};

export default BillingInformation;
