import React, { useState } from "react";
import { Collapse } from "reactstrap";
import filtreIcon from "../../assets/images/icons/filter.svg";

const FilterCollapse = (props) => {
  const { children, left = false } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <div className={`text-${left ? "left" : "right"} sort-filter`}>
        <button
          className="sort-filter-btn mb-3"
          color="primary"
          onClick={toggle}
        >
          <img src={filtreIcon} alt="filter" />
          Sort & Filter
        </button>
      </div>
      <Collapse isOpen={isOpen}>{children}</Collapse>
    </>
  );
};

export default FilterCollapse;
