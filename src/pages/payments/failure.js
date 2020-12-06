import React from "react";
import PaymentStatus from "./status";
import Failure from "../../assets/images/payment_failed.jpg";

const PaymentFailure = () => {
  return (
    <PaymentStatus
      alt="Payment Failed"
      status={"Payment Failed!"}
      image={Failure}
      route="/deals"
    />
  );
};

export default PaymentFailure;
