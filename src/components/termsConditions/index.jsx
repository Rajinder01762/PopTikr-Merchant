import React, { useEffect } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import { apiCallGet } from "../../common/api";

const TermsConditions = (props) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    getContentInfo();
  }, []);

  async function getContentInfo() {
    const contentInfo = await apiCallGet(`/getcontent?pageCode=termscondition`);
    contentInfo && contentInfo.success && setContent(contentInfo.results);
  }
  return (
    <div className="">
      <Row
        className="d-flex just-items-center   justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Col className="theme-card">
          <p className="container" style={{ textAlign: "justify" }}>
            {content || "No Content Found"}
          </p>
          <div className="container">
            <Button
              color="primary-black"
              onClick={() => props.history.goBack()}
            >
              Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default withRouter(TermsConditions);
