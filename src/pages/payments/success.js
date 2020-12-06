import React from "react";
import PaymentStatus from "./status";
import Success from "../../assets/images/success.jpg";

const PaymentSuccess = () => {
  return (
    <PaymentStatus
      alt="Payment Success"
      status={"Payment Success!"}
      image={Success}
      route="/deals"
    />
  );
};

export default PaymentSuccess;
