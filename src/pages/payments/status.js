import React from "react";
import classes from "./styles.module.scss";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

const PaymentStatus = ({ alt, status, image, route }) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.wrapperContent}>
        <img src={image} className={classes.success} alt={alt} />
        <div>
          <p className={classes.statusText}>{status}</p>
        </div>
        <Link to={route}>
          <Button
            size="sm"
            color="primary-black"
            className={classes.btnBack}
            onClick={() => {}}
          >
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentStatus;
