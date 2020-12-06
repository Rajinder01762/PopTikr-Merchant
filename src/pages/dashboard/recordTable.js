import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "reactstrap";
import editIcon from "../../assets/images/icons/edit-icon.svg";
import { apiCallGet, apiCallPost } from "../../common/api";
import { generateQueryParameters } from "../../common/utils";
import moment from "moment";
import cx from "classnames";
import Paginate from "../../components/tableComponents/pagination";
import { getFormattedData } from "../deals/addDeals/helper";
import { showErrorToast } from "../../common/toaster";
import FilterCollapse from "../../components/filterCollapse";
import FilterComponent from "./filterComponent";
import { Link } from "react-router-dom";

const headers = [
  { selector: "deal_name", sortable: true, name: "DEAL NAME" },
  { selector: "coupon_code", sortable: true, name: "COUPON CODE" },
  {
    selector: "nearbycount",
    sortable: true,
    name: "INSTORE <br/> #NO OF REDEEMS",
  },
  {
    selector: "onlinecount",
    sortable: true,
    name: "ONLINE <br/> #NO OF CLICKS",
  },
  { selector: "expired_date", sortable: true, name: "EXPIRY DATE" },
  { selector: "total", sortable: true, name: "TOTAL" },
  { selector: "paymentstatus", sortable: true, name: "PAYMENT" },
  { selector: "status", sortable: true, name: "STATUS" },
];

const RecodeTable = (props) => {
  const [dealData, setDealData] = useState({
    data: [],
    total: 0,
    perPage: 10,
  });
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(""); //asc|desc
  const [filters, setFilters] = useState({});
  const [isPageDropdownOpen, toggleDropDown] = useState(false);
  const [filterClass, setFilterClass] = useState("fas fa-sort");
  useEffect(() => {
    getDeals();
  }, [page, perPage, sortBy, sortOrder, filters, props.search !== ""]);

  async function getDeals() {
    const data = await apiCallGet(
      `${
        isAdmin ? "/admin/getdeallist" : "/getdeallist"
      }${generateQueryParameters({
        perPage,
        page,
        sb: sortBy,
        so: sortOrder,
        filtertype: props.filtertype,
        deal_name: props.search,
        filters,
      })}`
    );
    if (data.success) {
      setPage(data.results.page);
      setPerPage(data.results.perPage);
      setDealData(data.results);
    }
  }

  const handleSortBy = (selector) => {
    if (selector && selector !== sortBy) {
      setSortBy(selector);
      setSortOrder("asc");
      setFilterClass("fas fa-sort-up");
    } else if (selector === sortBy && sortOrder === "asc") {
      setSortBy(selector);
      setSortOrder("desc");
      setFilterClass("fas fa-sort-down");
    } else {
      setSortBy("");
      setSortOrder("");
      setFilterClass("fas fa-sort");
    }
  };
  const toggleSelect = (deal) => {
    selectedRow && selectedRow.id === deal.id
      ? setSelectedRow(null)
      : setSelectedRow(deal);
  };
  return (
    <div>
      <FilterCollapse left>
        <FilterComponent
          showStatus={false}
          onFilterChange={(fData) => setFilters(fData)}
          categories={props.categories}
        />
      </FilterCollapse>
      <div className="table-theme-wrapper">
        <Table hover responsive className="bg-white table-theme">
          <thead>
            <tr>
              {headers.map((data, index) => (
                <th
                  onClick={() => handleSortBy(data.selector)}
                  className="text-nowrap pointer"
                  key={index}
                >
                  <span dangerouslySetInnerHTML={{ __html: data.name }} />
                  <i
                    className={
                      data.selector === sortBy ? filterClass : "fas fa-sort"
                    }
                  />
                </th>
              ))}
              <th className="text-nowrap text-center">View / Edit</th>
            </tr>
          </thead>
          <tbody>
            {dealData.data.length > 0 ? (
              dealData.data.map((dealInfo) => (
                <tr key={dealInfo.id}>
                  <td className="text-nowrap">
                    <div className="d-flex align-items-center">
                      <label className="radioInput">
                        <Input
                          checked={
                            selectedRow && dealInfo.id === selectedRow.id
                          }
                          onChange={() => toggleSelect(dealInfo)}
                          type="checkbox"
                          className="mr-2"
                        />
                        <span className="radio-view" />
                      </label>
                      {dealInfo.deal_name}
                    </div>
                  </td>
                  <td className="text-nowrap">{dealInfo.coupon_code}</td>
                  <td className="text-nowrap">{dealInfo.nearbycount}</td>
                  <td className="text-nowrap">{dealInfo.onlinecount}</td>
                  <td className="text-nowrap">
                    {moment(dealInfo.expired_date).format("DD MMM YYYY")}
                  </td>
                  <td className="text-nowrap">${dealInfo.total}</td>
                  <td
                    className={cx({
                      "text-danger text-nowrap text-uppercase":
                        dealInfo.paymentstatus === "Unpaid",
                    })}
                  >
                    {dealInfo.paymentstatus}
                  </td>
                  <td className="text-nowrap text-uppercase">
                    {dealInfo.status}
                  </td>
                  <td className="text-nowrap text-center">
                    <Link className="ml-1" to={`/deals/edit/${dealInfo.id}`}>
                      <button className="btn-icon type-image">
                        <img src={editIcon} alt="edit" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <p className="text-nowrap text-center">No deal data to display</p>
            )}
          </tbody>
        </Table>

        <div className="view-detail-action">
          <Paginate
            pageCount={Math.ceil(dealData.total / perPage)}
            onPageChange={({ selected }) => setPage(selected + 1)}
            isPageDropdownOpen={isPageDropdownOpen}
            toggleDropDown={toggleDropDown}
            perPage={perPage}
            onItemClick={(item) => {
              if (item !== perPage) {
                setPage(1);
                setPerPage(item);
              }
              toggleDropDown(false);
            }}
          />
          <div>
            <Link className="ml-1" to="/deals/add">
              <Button className="ml-2" color="primary-black">
                + Add Deal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecodeTable;
