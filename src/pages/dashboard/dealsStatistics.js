import React from "react";
import { Col } from "reactstrap";
import { Card } from ".";

const Bar = ({ fill = 0 }) => (
  <div className="d-bar d-flex align-items-center ">
    <div className="bar flex-grow-1">
      <span
        className="bg-primary-black d-block"
        style={{ height: 10, width: `${fill}%` }}
      />
    </div>
    <span className="value">{fill}</span>
  </div>
);

const DealsStatistics = ({ redeemdata }) => {
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  return (
    <Col md={isAdmin ? 4 : 6}>
      <Card title="Statistics">
        <div className="statistics-card">
          <div className="el">
            <div className="info">
              <p>
                Redeemed Deals
                <span>Instore</span>
              </p>
            </div>
            <Bar fill={redeemdata?.nearby || "0"} />
          </div>
          <div className="el">
            <div className="info">
              <p>
                Redeemed Deals
                <span>Online</span>
              </p>
            </div>
            <Bar fill={redeemdata?.online || "0"} />
          </div>
        </div>
      </Card>
    </Col>
  );
};
export default DealsStatistics;
