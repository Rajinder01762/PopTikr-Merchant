import React, { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { Row, Col, FormGroup, Input } from "reactstrap";
import RecordTable from "./recordTable";
import { withRouter } from "react-router";
import _ from "lodash";
import ActiveDeals from "./activeDeals";
import DealsCount from "./dealsCount";
import DealtStatus from "./dealStatus";
import DealsStatistics from "./dealsStatistics";
import { apiCallGet } from "../../common/api";

const tabs = [
  { id: 1, name: "All Deals" },
  { id: 2, name: "Active Deals" },
  { id: 3, name: "In-Active Deals" },
  { id: 4, name: "Completed Deals" },
];

export const Card = ({ title, children }) => (
  <div className="d-card d-flex flex-column h-100 justify-content-between theme-card">
    <h4 className="d-title">{title}</h4>
    <div>{children}</div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(1);
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const [data, setData] = useState({});
  const [merhchantList, setMerchants] = useState([]);

  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    getDealsStatistics();
    isAdmin && getMerchants();
  }, []);

  const debounceInput = useCallback(
    _.debounce((value) => setSearch(value), 1000),
    []
  );

  async function getMerchants() {
    const response = await apiCallGet("/admin/merchant");
    if (response?.success) setMerchants(response?.results?.data);
  }
  const onChange = (e) => {
    setInputValue(e.target.value);
    debounceInput(e.target.value);
  };
  async function getDealsStatistics() {
    const response = await apiCallGet(
      isAdmin ? "/admin/getdealstatusdata" : "/getdealstatusdata"
    );

    if (response?.success) setData(response.results);
  }
  return (
    <div>
      <Row className="mb-3">
        <DealsCount dealdata={data?.dealdata} />
        {isAdmin && <DealtStatus statusdata={data?.statusdata} />}
        <DealsStatistics redeemdata={data?.redeemdata} />
      </Row>
      <div className="filter-tabs">
        <ul className="tabs">
          {tabs.map(({ id, name }) => (
            <li key={id}>
              <button
                className={cx({ active: activeTab === id })}
                onClick={() => setActiveTab(id)}
              >
                {name}
              </button>
            </li>
          ))}

          <FormGroup className="mt-2 mb-0 search-input">
            <Input
              onChange={onChange}
              value={inputValue}
              type="search"
              placeholder="Search Deals"
            />
          </FormGroup>
        </ul>
      </div>
      <div>
        <Row>
          <Col md={7} lg={8}>
            {activeTab === 1 && (
              <RecordTable search={search} filtertype="All" />
            )}
            {activeTab === 2 && (
              <RecordTable search={search} filtertype="Active" />
            )}
            {activeTab === 3 && (
              <RecordTable search={search} filtertype="Inactive" />
            )}
            {activeTab === 4 && (
              <RecordTable search={search} filtertype="Completed" />
            )}
          </Col>
          <Col md={5} lg={4}>
            <ActiveDeals />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default withRouter(Dashboard);
