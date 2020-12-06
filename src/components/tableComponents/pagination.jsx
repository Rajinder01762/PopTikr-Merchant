import React, { useEffect, useState } from "react";
import Paginate from "react-paginate";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export default ({ pageCount, onPageChange, perPage, onItemClick }) => {
  const [isPageDropdownOpen, toggleDropDown] = useState(false);
  return (
    <div className="d-flex">
      <Paginate
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        breakClassName={"text-black"}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={6}
        onPageChange={onPageChange}
        pageClassName="page-item  mr-2"
        pageLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        previousClassName="page-item mr-2"
        previousLinkClassName="page-link"
        activeClassName="active"
        // activeLinkClassName="primary"
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
      />
      <Dropdown
        className="ml-3"
        isOpen={isPageDropdownOpen}
        toggle={() => toggleDropDown(!isPageDropdownOpen)}
        direction="down"
      >
        <DropdownToggle className="bg-white  text-muted border-white" caret>
          {perPage}/Page
        </DropdownToggle>
        <DropdownMenu>
          {[10, 20, 30, 40, 50].map((item) => (
            <DropdownItem
              className={item === perPage ? "active" : ""}
              key={item}
              onClick={() => {
                onItemClick(item);
                toggleDropDown(!isPageDropdownOpen);
              }}
            >
              {item}/Page
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
