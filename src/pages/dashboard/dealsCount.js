import React from "react";
import { Col } from "reactstrap";
import { Card } from ".";

const DealsCount = ({ dealdata }) => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  return (
    <Col md={isAdmin ? 4 : 6}>
      <Card title="Deals">
        <div className="d-flex justify-content-between deals-card">
          <p>
            {dealdata?.active || 0}
            <span>Active</span>
          </p>
          <p>
            {dealdata?.inactive || 0}
            <span>Inactive</span>
          </p>
          <p>
            {dealdata?.completed || 0}
            <span>Complete</span>
          </p>
        </div>
      </Card>
    </Col>
  );
};

export default DealsCount;
