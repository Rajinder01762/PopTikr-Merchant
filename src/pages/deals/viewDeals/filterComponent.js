import React, { useEffect, useState } from "react";
import { Input, FormGroup, Label } from "reactstrap";
import { useCategories } from "../../../common/apiHooks";

const FilterInput = ({ label = "", name = "", checked, handleChange }) => (
  <FormGroup check>
    <Label check>
      <Input
        onChange={handleChange}
        name={name}
        checked={checked}
        type="checkbox"
      />
      {label}
    </Label>
    {false && <span className="text-danger form-error-text">error</span>}
  </FormGroup>
);

const FilterComponent = ({ onFilterChange }) => {
  const [coupon_category, setCoupon_category] = useState({});
  const categories = useCategories();
  const [paymentstatus, setPaymentstatus] = useState({
    Paid: false,
    Unpaid: false,
  });
  const [status, setStatus] = useState({ Active: false, Inactive: false });
  const [coupon_mode, setCoupon_mode] = useState({
    NearBy: false,
    Online: false,
    Both: false,
  });
  useEffect(() => {
    const formattedFilter = getFormattedData(
      coupon_category,
      paymentstatus,
      coupon_mode,
      status,
      categories
    );
    onFilterChange(formattedFilter);
  }, [coupon_category, paymentstatus, coupon_mode, status]);
  return (
    <div className="theme-card mb-3 filter-form">
      <table className="w-100">
        <tr>
          <td>
            <p className="f-title">COUPON TYPE</p>
            <FilterInput
              handleChange={() =>
                setCoupon_mode({ ...coupon_mode, NearBy: !coupon_mode.NearBy })
              }
              checked={coupon_mode.NearBy}
              label="NearBy"
              name="NearBy"
            />
            <FilterInput
              handleChange={() =>
                setCoupon_mode({ ...coupon_mode, Online: !coupon_mode.Online })
              }
              checked={coupon_mode.Online}
              label="Online"
              name="Online"
            />
            <FilterInput
              handleChange={() =>
                setCoupon_mode({ ...coupon_mode, Both: !coupon_mode.Both })
              }
              checked={coupon_mode.Both}
              label="Both"
              name="Both"
            />
          </td>
          <td>
            <p className="f-title">CATEGORIES</p>
            <div className="category-inp">
              <FilterInput
                handleChange={() =>
                  setCoupon_category({
                    ...coupon_category,
                    all: !coupon_category["all"],
                  })
                }
                checked={coupon_category["all"]}
                label="All"
                name="all"
              />
              {categories &&
                categories.length &&
                categories.map((item) => {
                  return (
                    <FilterInput
                      handleChange={() =>
                        setCoupon_category({
                          ...coupon_category,
                          [item.category_id]: !coupon_category[
                            item.category_id
                          ],
                        })
                      }
                      checked={coupon_category[item.category_id]}
                      label={item.category_name}
                    />
                  );
                })}
            </div>
          </td>
          <td>
            <p className="f-title">PAYMENT STATUS</p>
            <div>
              <FilterInput
                handleChange={() =>
                  setPaymentstatus({
                    ...paymentstatus,
                    Paid: !paymentstatus.Paid,
                  })
                }
                checked={paymentstatus.Paid}
                label="Paid"
                name="paymentstatus"
              />
              <FilterInput
                handleChange={() =>
                  setPaymentstatus({
                    ...paymentstatus,
                    Unpaid: !paymentstatus.Unpaid,
                  })
                }
                checked={paymentstatus.Unpaid}
                label="Unpaid"
                name="paymentstatus"
              />
            </div>
          </td>
          <td>
            <p className="f-title">DEAL STATUS</p>
            <div>
              <FilterInput
                handleChange={() =>
                  setStatus({ ...status, Active: !status.Active })
                }
                checked={status.Active}
                label="Active"
                name="paymentstatus1"
              />
              <FilterInput
                handleChange={() =>
                  setStatus({ ...status, Inactive: !status.Inactive })
                }
                checked={status.Inactive}
                label="Inactive"
                name="paymentstatus2"
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};

function getFormattedData(ct, ps, cm, st, allCategories) {
  let catKeys;
  if (ct.all) {
    catKeys = allCategories.map((ctItem) => ctItem.category_id);
  } else {
    catKeys = getKeys(ct);
  }
  const filter = {
    coupon_category: catKeys,
    paymentstatus: getKeys(ps),
    coupon_mode: getKeys(cm),
    status: getKeys(st),
  };

  return filter;
}
function getKeys(obj) {
  const data = [];
  for (let key in obj) {
    if (obj[key]) {
      data.push(key);
    }
  }
  return data;
}
export default FilterComponent;
