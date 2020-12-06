import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "reactstrap";
import editIcon from "../../../assets/images/icons/edit-icon.svg";
import { apiCallGet, apiCallPost, apiCallDelete } from "../../../common/api";
import { generateQueryParameters } from "../../../common/utils";
import moment from "moment";
import cx from "classnames";
import Paginate from "../../../components/tableComponents/pagination";
import { getFormattedData } from "../addDeals/helper";
import { showErrorToast } from "../../../common/toaster";
import FilterCollapse from "../../../components/filterCollapse";
import FilterComponent from "./filterComponent";
import { useMerchantProfile } from "../../../common/apiHooks";
import { ConfirmModal } from "../../../components/modal";
import { Link } from "react-router-dom";
const headers = [
  { selector: "deal_name", sortable: true, name: "Deal Name" },
  { selector: "coupon_code", sortable: true, name: "Coupon Code" },
  { selector: "start_date", sortable: true, name: "Start Date" },
  { selector: "end_date", sortable: true, name: "End Date" },
  { selector: "duration", sortable: true, name: "No of Days" },
  { selector: "coupon_mode", sortable: true, name: "Coupon Mode" },
  { selector: "title", sortable: true, name: "Title" },
  { selector: "quantity", sortable: true, name: "Quantity" },
  { selector: "paymentstatus", sortable: true, name: "Payment" },
  { selector: "status", sortable: true, name: "Status" },
];

const ViewDeals = (props) => {
  const [dealData, setDealData] = useState({
    data: [],
    total: 0,
    perPage: 10,
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(""); //asc|desc
  const [filters, setFilters] = useState({});
  const [isPageDropdownOpen, toggleDropDown] = useState(false);
  const [filterClass, setFilterClass] = useState("fas fa-sort");
  const [profile] = useMerchantProfile();
  const [isOpenDelete, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDealName, setDeleteDealName] = useState("");
  const merchantDiscount = profile ? profile.program_discount : 0;
  useEffect(() => {
    setTimeout(() => {
      getDeals();
    }, 10);
  }, [page, perPage, sortBy, sortOrder, filters, props.search !== ""]);

  async function getDeals() {
    const data = await apiCallGet(
      `/merchantcoupons${generateQueryParameters({
        perPage,
        page,
        sb: sortBy,
        so: sortOrder,
        deal_name: props.search,
        ...filters,
      })}`
    );
    if (data.success) {
      setPage(data.results.page);
      setPerPage(data.results.perPage);
      setDealData(data.results);
    }
  }
  async function duplicateDeal() {
    if (selectedRow) {
      const dealToDuplicate = await apiCallGet(
        `/merchantcoupon/${selectedRow.id}`
      );

      const payload = getFormattedData(
        dealToDuplicate.results,
        merchantDiscount
      );
      await apiCallPost(`/merchantcoupon`, payload, true);
      getDeals();
      setSelectedRow(null);
    } else {
      showErrorToast("Select a deal to duplicate");
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

  async function deleteDeal() {
    await apiCallDelete(`/merchantcoupon/${deleteId}`, true);
    setDeleteModal(false);
  }
  const toggleSelect = (deal) => {
    selectedRow && selectedRow.id === deal.id
      ? setSelectedRow(null)
      : setSelectedRow(deal);
  };
  return (
    <div>
      <FilterCollapse>
        <FilterComponent onFilterChange={(fData) => setFilters(fData)} />
      </FilterCollapse>
      <ConfirmModal
        toggle={() => setDeleteModal(!isOpenDelete)}
        isOpen={isOpenDelete}
        title="Confirm"
        content={`Do you want to delete ${deleteDealName} deal?`}
        onConfirm={() => deleteDeal()}
      />
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
                  {data.name}{" "}
                  <i
                    className={
                      data.selector === sortBy ? filterClass : "fas fa-sort"
                    }
                  />
                </th>
              ))}
              <th className="text-nowrap text-center">View / Edit</th>
              <th className="text-nowrap text-center">Delete</th>
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
                      <Link to={`/deals/edit/${dealInfo.id}`}>
                        {dealInfo.deal_name}
                      </Link>
                    </div>
                  </td>
                  <td className="text-nowrap">{dealInfo.coupon_code}</td>
                  <td className="text-nowrap">
                    {moment(dealInfo.start_date).format("DD MMM YYYY")}
                  </td>
                  <td className="text-nowrap">
                    {moment(dealInfo.end_date).format("DD MMM YYYY")}
                  </td>
                  <td className="text-nowrap">{dealInfo.duration}</td>
                  <td className="text-nowrap">{dealInfo.coupon_mode}</td>
                  <td className="text-nowrap">{dealInfo.title}</td>
                  <td className="text-nowrap">{dealInfo.quantity}</td>
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
                    <button
                      onClick={() => props.handleOnEditOrView(dealInfo.id)}
                      className="btn-icon type-image"
                    >
                      <img src={editIcon} alt="edit" />
                    </button>
                  </td>
                  <td className=" text-nowrap text-center">
                    <button
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(dealInfo.id);
                        setDeleteDealName(dealInfo.deal_name);
                      }}
                      className="btn-icon type-image"
                    >
                      <i className={"fas fa-trash"} />
                    </button>
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
            <Button
              onClick={() => duplicateDeal(selectedRow)}
              className="ml-2"
              color="primary-black"
            >
              Duplicate Deal
            </Button>
            <Button
              className="ml-2"
              onClick={() => props.handleOnEditOrView()}
              color="primary-black"
            >
              + Add Deal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDeals;
