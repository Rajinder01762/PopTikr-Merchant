import React, { useCallback, useEffect, useState } from "react";
import { FormGroup, Input } from "reactstrap";
import ViewDeals from "./viewDeals";
import AddDeals from "./addDeals";
import cx from "classnames";
import _ from "lodash";
import { Link, useHistory, useParams } from "react-router-dom";

const tabs = [
  { id: 1, name: "View Deals", route: "/deals" },
  { id: 2, name: "Add Deals", route: "/deals/add" },
];

const Deals = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const history = useHistory();
  const { dealId } = useParams();
  const { location } = history;
  const { pathname } = location;

  useEffect(() => {
    setSelectedDealId(dealId);
  }, [dealId]);

  const handleOnEditOrView = (dealNumber = "") => {
    if (dealNumber) history.push(`/deals/edit/${dealNumber}`);
    else history.push("/deals/add");
  };
  const debounceInput = useCallback(
    _.debounce((value) => setSearch(value), 1000),
    []
  );
  const onChange = (e) => {
    setInputValue(e.target.value);
    debounceInput(e.target.value);
  };

  let activeTabView = 1;
  if (pathname.includes("/deals/add") || pathname.includes("/deals/edit")) {
    activeTabView = 2;
  }
  return (
    <div>
      <div className="filter-tabs">
        <div className="d-flex align-items-center justify-content-between">
          <ul className="tabs">
            {tabs.map(({ id, name, route }) => (
              <li key={id}>
                <Link to={route}>
                  <button
                    className={cx({ active: activeTabView === id })}
                    onClick={() => {
                      setActiveTab(id);
                      id === 1 && setSelectedDealId(null);
                    }}
                  >
                    {name}
                  </button>
                </Link>
              </li>
            ))}
          </ul>
          {activeTab === 1 && (
            <FormGroup className="mb-0 search-input">
              <Input
                onChange={onChange}
                value={inputValue}
                type="search"
                placeholder="Search Deals"
              />
            </FormGroup>
          )}
        </div>
      </div>
      {activeTabView === 1 && (
        <ViewDeals search={search} handleOnEditOrView={handleOnEditOrView} />
      )}
      {activeTabView === 2 && (
        <AddDeals setDealId={handleOnEditOrView} dealId={selectedDealId} />
      )}
    </div>
  );
};

export default Deals;
