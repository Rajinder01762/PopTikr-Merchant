import React from "react";
import { Col } from "reactstrap";
import { Card } from ".";
import check from "../../assets/images/icons/check.svg";
import shedule from "../../assets/images/icons/schedule.svg";

const DealtStatus = ({ statusdata }) => {
  return (
    <Col md={4}>
      <Card title="Status">
        <div className="staus-card">
          <div className="el">
            <div className="icon-wrap">
              <div className="icon aprprove">
                <img src={check} />
              </div>
            </div>
            <div className="content">
              <p>
                Awaiting Approval
                <span>{statusdata?.approved_count || 0} Deals</span>
              </p>
            </div>
          </div>
          <div className="el">
            <div className="icon-wrap">
              <div className="icon shedule">
                <img src={shedule} />
              </div>
            </div>
            <div className="content">
              <p>
                Pending Action
                <span>{statusdata?.awaiting_count || 0} Deals</span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Col>
  );
};
export default DealtStatus;
