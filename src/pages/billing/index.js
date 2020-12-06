import React from "react";
import Billing from "../../components/billing";
import Table from "../../components/tableComponents/table";

const headers = [
  { selector: "deal_name", sortable: true, name: "Deal Name" },
  { selector: "coupon_code", sortable: true, name: "Coupon Code" },
];
export default () => {
  return (
    <div>
      <div className="acc-form-head"></div>
      <Table
        showAction={true}
        headers={headers}
        data={[{ deal_name: "Test", coupon_code: "RREE" }]}
      />
      {/* <Billing /> */}
    </div>
  );
};
