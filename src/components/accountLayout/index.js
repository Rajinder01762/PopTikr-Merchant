import React from "react";
import logo from "../../assets/images/logo.png";
import { Row, Col } from "reactstrap";
import classes from "./styles.module.scss";

const AccountLayout = ({ children }) => (
  <Row className="mx-0" style={{ minHeight: "100vh" }}>
    <Col
      lg={6}
      className="py-5 bg-primary-black d-flex align-items-center  justify-content-center"
    >
      <img src={logo} className={classes.logo} alt="logo" />
    </Col>
    <Col lg={6} className="py-5 d-flex align-items-center">
      <div className="w-100">{children}</div>
    </Col>
  </Row>
);

export default AccountLayout;
