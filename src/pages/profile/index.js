import React, { useState } from "react";
import {
  Locations,
  BillingInformation,
  BasicDetails,
  AdminProfile,
} from "../../components/profile";
import cx from "classnames";
import { useMerchantLocations } from "../../common/apiHooks";
import ChangePassword from "../../components/profile/changePassword";

const tabs = [
  { id: 1, name: "Basic Details" },
  { id: 2, name: "Change Password" },
  { id: 3, name: "Locations" },
  { id: 4, name: "Billing Information" },
];
const adminTabs = [
  { id: 1, name: "Basic Details" },
  { id: 2, name: "Change Password" },
];
const Profile = () => {
  const [activeTab, setActiveTab] = useState(1);
  const locations = useMerchantLocations();
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const tabItems = isAdmin ? adminTabs : tabs;
  const isExistLocation =
    locations && Array.isArray(locations) && locations.length > 0;
  return (
    <div>
      {!isExistLocation && (
        <p>Complete your profle updates and start create your deals!</p>
      )}

      <div className="filter-tabs">
        <ul className="tabs">
          {tabItems.map(({ id, name }) => (
            <li key={id}>
              <button
                className={cx({ active: activeTab === id })}
                onClick={() => {
                  setActiveTab(id);
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {activeTab === 1 && (isAdmin ? <AdminProfile /> : <BasicDetails />)}
      {activeTab === 2 && <ChangePassword />}
      {activeTab === 3 && <Locations />}
      {activeTab === 4 && <BillingInformation />}
    </div>
  );
};

export default Profile;
