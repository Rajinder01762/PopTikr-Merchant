import React, { useEffect, useState } from "react";
import Chart from "./chart";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { apiCallGet } from "../../../common/api";
import { generateQueryParameters } from "../../../common/utils";

const Arrow = () => (
  <svg
    height="20"
    width="20"
    viewBox="0 0 20 20"
    aria-hidden="true"
    focusable="false"
    fill="currentColor"
  >
    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
  </svg>
);

const Options = ({ filtertype, handleChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <div className="text-center">
        <DropdownToggle
          size="sm"
          color="primary-black"
          outline
          className="border-0 d-inline-flex align-items-center"
        >
          <span style={{ fontWeight: 500 }}>{filtertype}</span> <Arrow />
        </DropdownToggle>
      </div>
      <DropdownMenu>
        <DropdownItem onClick={() => handleChange("All")}>All</DropdownItem>
        <DropdownItem onClick={() => handleChange("Active")}>
          Active
        </DropdownItem>
        <DropdownItem onClick={() => handleChange("Inactive")}>
          Inactive
        </DropdownItem>
        <DropdownItem onClick={() => handleChange("Completed")}>
          Completed
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const ActiveDeals = () => {
  const [data, setData] = useState([]);
  const [filtertype, setFilter] = useState("All");
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  useEffect(() => {
    getChartData();
  }, [filtertype]);

  async function getChartData() {
    const info = await apiCallGet(
      `${
        isAdmin ? "/admin/getdealchartdata" : "/getdealchartdata"
      }${generateQueryParameters({ filtertype })}`
    );
    info?.success && setData(info?.results?.data || []);
  }
  return (
    <div className="theme-card pt-2 mt-5">
      <Options filtertype={filtertype} handleChange={setFilter} />
      <Chart data={data} />
    </div>
  );
};

export default ActiveDeals;
