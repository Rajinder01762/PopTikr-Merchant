import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import Menus from "./menus";
import logo from "../../../assets/images/logo.svg";
import notificationIcon from "../../../assets/images/icons/notification.svg";
import cx from "classnames";
import {
  useMerchantProfile,
  useMerchantLocations,
} from "../../../common/apiHooks";

export default () => {
  const [stickey, setStickey] = useState(false);
  const [profileInfo] = useMerchantProfile();
  const locations = useMerchantLocations();

  const handleScroll = () => {
    let scrollPosition = window.scrollY;
    if (scrollPosition >= 60) {
      setStickey(true);
    } else {
      setStickey(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <header id="header" className={cx({ stickey })}>
      <div className="d-flex justify-content-between holder">
        <div className="menuWrapper">
          <div className="bg-primary-black logo">
            <Link to="/dashboard">
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <Menus locations={locations} />
        </div>
        <div className="d-flex align-items-center">
          <p className="welcome-text">
            Welcome Back!{" "}
            <b>
              {profileInfo ? profileInfo.first_name : ""}{" "}
              {profileInfo ? profileInfo.last_name : ""}
            </b>
          </p>
          <div className="notifiction-wrapper">
            <button className={cx("notifiction-btn", { isNotification: true })}>
              <img src={notificationIcon} alt="notification" />
            </button>
          </div>
          <div className="profile-action">
            {profileInfo && profileInfo.logo_path ? (
              <img
                src={profileInfo ? profileInfo.logo_path : ""}
                alt="logo"
                className="profile"
              />
            ) : (
              <i className={`fas fa-user`} />
            )}
            <Button
              color="primary-black"
              className="mx-2 border-0"
              outline
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
