import React, { useEffect, useState } from "react";
import { Input, Table } from "reactstrap";
import editIcon from "../../../../assets/images/icons/edit-icon.svg";
import Paginate from "../../../../components/tableComponents/pagination";
import { apiCallGet } from "../../../../common/api";
import { generateQueryParameters } from "../../../../common/utils";

const headers = [
  { selector: "location_name", sortable: true, name: "Name" },
  { selector: "address", sortable: true, name: "Address" },
  { selector: "category", sortable: true, name: "Category" },
  { selector: "is_primary", sortable: true, name: "Is primary" },
];

const ManageLocations = (props) => {
  const { forceRefresh, setForceRefresh } = props;
  const [locationData, setLocationData] = useState({
    data: [],
    total: 0,
    perPage: 10,
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isPageDropdownOpen, toggleDropDown] = useState(false);
  const [filterClass, setFilterClass] = useState("fas fa-sort");

  useEffect(() => {
    getLocations();
  }, [page, perPage, sortBy, sortOrder, forceRefresh]);

  async function getLocations() {
    const locationDataInfo = await apiCallGet(
      `/merchantlocations${generateQueryParameters({
        page,
        perPage,
        so: sortOrder,
        sb: sortBy,
      })}`
    );
    locationDataInfo &&
      locationDataInfo.success &&
      locationDataInfo.results &&
      locationDataInfo.results.data &&
      setLocationData(locationDataInfo.results);
  }

  const handleSortBy = (selector) => {
    if (selector && selector !== sortBy) {
      setSortBy(selector);
      setSortOrder("asc");
      setFilterClass("fas fa-sort-up");
    } else if (selector === sortBy && sortOrder === "asc") {
      setSortBy(selector);
      setSortOrder("dsc");
      setFilterClass("fas fa-sort-down");
    } else {
      setSortBy("");
      setSortOrder("");
      setFilterClass("fas fa-sort");
    }
  };

  const toggleSelect = (location) => {
    selectedRow && selectedRow.id === location.id
      ? setSelectedRow(null)
      : setSelectedRow(location);
  };

  return (
    <div className="h-100">
      <div className="table-theme-wrapper profile-table h-100 d-flex flex-column">
        <Table responsive className="bg-white table-theme">
          <thead>
            <tr>
              <th className="border-0 text-center" colSpan={3}>
                <span style={{ fontSize: "120%" }}>MANAGE LOCATIONS</span>
              </th>
            </tr>
            <tr>
              {headers &&
                headers.length > 0 &&
                headers.map((data, index) => {
                  return (
                    <th
                      onClick={() => handleSortBy(data.selector)}
                      className="text-nowrap pointer border-top-0"
                      key={index}
                    >
                      {data.name}{" "}
                      <i
                        className={
                          data.selector === sortBy ? filterClass : "fas fa-sort"
                        }
                      />
                    </th>
                  );
                })}
              <th className="text-nowrap border-top-0">Edit</th>
            </tr>
          </thead>
          <tbody>
            {locationData &&
            locationData.data &&
            locationData.data.length > 0 ? (
              locationData.data.map((locationInfo) => {
                return (
                  <tr key={locationInfo.id}>
                    <td className="text-nowrap">
                      <div className="d-flex align-items-center">
                        <label className="radioInput">
                          <Input
                            type="checkbox"
                            checked={
                              selectedRow && locationInfo.id === selectedRow.id
                            }
                            onChange={() => toggleSelect(locationInfo)}
                            className="mr-2"
                          />
                          &nbsp;
                          <span className="radio-view" />
                        </label>
                        {locationInfo.location_name || ""}
                      </div>
                    </td>
                    <td className="text-nowrap">
                      {locationInfo?.address || ""}
                    </td>
                    <td className="text-nowrap">
                      {locationInfo.category || ""}
                    </td>
                    <td className="text-nowrap">
                      {locationInfo?.is_primary || ""}
                    </td>
                    <td>
                      <button
                        className="btn-icon type-image"
                        onClick={() =>
                          props.handleEditLocation(locationInfo.id)
                        }
                      >
                        <img src={editIcon} alt="edit" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <p className="text-nowrap text-center">
                No location data to display
              </p>
            )}
          </tbody>
        </Table>
        <div className="view-detail-action mt-4">
          <Paginate
            pageCount={Math.ceil(locationData.total / perPage)}
            onPageChange={({ selected }) => setPage(selected + 1)}
            isPageDropdownOpen={isPageDropdownOpen}
            toggleDropDown={toggleDropDown}
            perPage={perPage}
            onItemClick={(item) => {
              item !== perPage && setPerPage(item);
              toggleDropDown(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageLocations;
