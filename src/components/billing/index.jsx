import React from "react";
import { Col, Row, Table } from "reactstrap";
import _ from "lodash";

const Billing = () => {
  const headers = [
    { selector: "transaction_id", name: " Transaction id" },
    { selector: "deal_name", name: "Deal Name" },
    { selector: "quantity", name: "Quantity" },
    { selector: "price", name: "Price" },
  ];
  return (
    <div className="container">
      <Row className="d-flex just-items-center  justify-content-center">
        <Col className="theme-card  d-flex align-items-center">
          <Table>
            <thead>
              <tr>
                <th className="border-0 text-center" colSpan={3}>
                  <span style={{ fontSize: "120%" }}>Billing History</span>
                </th>
              </tr>
              <tr>
                {_.head(headers) &&
                  headers.map((item) => {
                    return <th>{item.name || ""}</th>;
                  })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"q12121212121212"}
                  </div>
                </td>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"Living denim"}
                  </div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"5"}</div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"500"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"q12121212121212"}
                  </div>
                </td>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"Living denim"}
                  </div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"5"}</div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"500"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"q12121212121212"}
                  </div>
                </td>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"Living denim"}
                  </div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"5"}</div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"500"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"q12121212121212"}
                  </div>
                </td>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"Living denim"}
                  </div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"5"}</div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"500"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"q12121212121212"}
                  </div>
                </td>
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">
                    {"Living denim"}
                  </div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"5"}</div>
                </td>{" "}
                <td className="text-nowrap">
                  <div className="d-flex align-items-center">{"500"}</div>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};
export default Billing;
