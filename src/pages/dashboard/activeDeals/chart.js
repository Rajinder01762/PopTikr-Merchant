import React from "react";
import { Row, Col } from "reactstrap";
import cx from "classnames";
const Bar = ({ fill = 0, colorClasName = "primary-black" }) => (
  <div className="d-bar">
    <div className="bar flex-grow-1">
      <span
        className={`bg-${colorClasName} d-block`}
        style={{ height: 10, width: `${fill}%` }}
      />
    </div>
  </div>
);

const Chart = ({ data }) => {
  return (
    <div>
      <Row className="pt-3 pb-5">
        <Col>
          <p className="a-detail-barOption">
            <span className="fill fill-primary" />
            INSTORE
          </p>
        </Col>
        <Col>
          <p className="a-detail-barOption">
            <span className="fill" />
            ONLINE
          </p>
        </Col>
      </Row>
      {data &&
        data.map(
          ({ nearbycount = 0, onlinecount = 0, deal_name = "" }, index) => (
            <div
              key={deal_name}
              className={cx("d-bar-chart-wrapper", { "mt-4": index !== 0 })}
            >
              <div className="text-col">
                <p>{deal_name}</p>
              </div>
              <div className="bar-col">
                <Bar fill={nearbycount} />
                <Bar fill={onlinecount} colorClasName="primary" />
              </div>
            </div>
          )
        )}
    </div>
  );
};

export default Chart;
