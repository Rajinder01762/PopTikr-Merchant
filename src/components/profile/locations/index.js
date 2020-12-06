import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { ProfileAddressForm } from "../../form";
import ManageLocations from "./manageLocations";
import { useMerchantProfile } from "../../../common/apiHooks";

const Locations = () => {
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [profile] = new useMerchantProfile();

  const handleEditLocation = (locationId) => {
    setSelectedLocationId(locationId);
  };
  return (
    <div className="profile-tab">
      <div className="logo-column">
        <div className="theme-card  mb-3  p-0">
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
        <Row>
          <Col lg={6} xl={6}>
            <ProfileAddressForm
              forceRefresh={forceRefresh}
              locationId={selectedLocationId}
              setForceRefresh={setForceRefresh}
              setLocationId={setSelectedLocationId}
            />
          </Col>
          <Col lg={6} xl={6}>
            <ManageLocations
              forceRefresh={forceRefresh}
              setForceRefresh={setForceRefresh}
              handleEditLocation={handleEditLocation}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Locations;
