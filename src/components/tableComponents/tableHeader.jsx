import React, { useState } from "react";

import { FormGroup, Input } from "reactstrap";

export default ({
  headers,
  showDelete,
  showEdit,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  title,
  showSwitch,
  onChange,
  searchValue,
}) => {
  const [filterClass, setFilterClass] = useState("fas fa-sort");

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

  return (
    <thead>
      {title && (
        <tr>
          <th className="border-0 text-center" colSpan={headers.length}>
            <span style={{ fontSize: "120%" }}>{title}</span>
          </th>
          <th colSpan={2}>
            <div className="d-flex align-items-center justify-content-between">
              <FormGroup className="mb-0 search-input">
                <Input
                  onChange={onChange}
                  type="search"
                  value={searchValue}
                  placeholder="Search..."
                />
              </FormGroup>
            </div>
          </th>
        </tr>
      )}
      <tr>
        {headers.map((data, index) => {
          return (
            <>
              {!data.hidden ? (
                <th
                  onClick={() => data.sortable && handleSortBy(data.selector)}
                  className="text-nowrap pointer"
                  key={index}
                >
                  {data.name}
                  {data.sortable && (
                    <i
                      className={
                        data.selector === sortBy ? filterClass : "fas fa-sort"
                      }
                    />
                  )}
                </th>
              ) : null}
            </>
          );
        })}
        {showEdit && <th className="text-nowrap text-center">View / Edit</th>}
        {showDelete && <th className="text-nowrap text-center">Delete</th>}
        {showSwitch && <th className="text-nowrap text-center">Activate</th>}
      </tr>
    </thead>
  );
};
