import React, { useEffect } from "react";
import { Modal, ModalBody, Button } from "reactstrap";
import { useMerchantLocations, useAppSettings } from "../../../common/apiHooks";
import { apiCallPatch } from "../../../common/api";
import cx from "classnames";
import { showSuccessToast } from "../../../common/toaster";

const ReviewOrderModal = ({ isOpen, setIsOpen, dealData }) => {
  console.log("ddd", dealData);
  const locations = useMerchantLocations();
  const dealPrice = useAppSettings();
  const quantity = dealData?.quantity || 1;
  const discount = 1 * dealData.duration * quantity;

  let tax = 0;
  if (dealData?.coupon_location && locations) {
    Array.isArray(dealData.coupon_location) &&
      dealData.coupon_location.forEach((element) => {
        const info = locations.find((item) => item.location_id === element);
        if (info?.tax_amount) tax += info?.tax_amount;
      });
  }
  const price = dealPrice * dealData.duration;
  const dataToUpdate = {
    ...dealData,
    paymentstatus: "Paid",
    discount,
    total: (price + tax) * quantity - discount,
    tax,
    deal_price: dealPrice,
    subtotal: (price + tax) * quantity,
  };

  const reviewData = [
    {
      title: "Deal Price",
      value: `${dealPrice} X ${dealData.duration} =${price} CAD Dollars`,
    },
    { title: "Quantity", value: `${quantity}` },
    { title: "Service", value: `${dealData.service_tax} CAD. dollars` },
    { title: "Fee Tax", value: `${tax} CAD. dollars` },
    { title: "Sub Total", value: `${dataToUpdate.subtotal} CAD dollars` },
    { title: "Discount", value: `-${discount} CAD dollars` },
    {
      title: "Total",
      value: `${dataToUpdate.total} CAD dollars`,
      className: "total",
    },
  ];

  async function updateDeal() {
    const info = await apiCallPatch(
      `/merchantcoupon/${dealData.id}`,
      dataToUpdate
    );
    setIsOpen(!isOpen);
    info?.success
      ? showSuccessToast("Deal payment success")
      : showSuccessToast("Failed to pay at this time");
  }

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      centered
      className="ordder-reviewModal"
    >
      <ModalBody>
        <h3 className="text-uppercase title">Review Order</h3>
        <p>Deal Name: {dealData.deal_name || ""}</p>
        <p>Duration: {dealData.duration || 0} Days</p>

        <table className="w-100">
          <tbody>
            {reviewData.map(({ title, value, className = "" }, index) => (
              <tr key={index}>
                <td className={cx(className)}>{title}</td>
                <td className={cx(className)}>{value}</td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </table>
        <p className="note">
          Due to pandemic we are have discounted our price from $2 to $1 per
          day. This is a limited time offer only.
        </p>
      </ModalBody>
      <div className="d-flex">
        <Button onClick={() => setIsOpen(!isOpen)} className="flex-grow-1 ">
          Back
        </Button>

        <Button
          onClick={() => updateDeal()}
          className="flex-grow-1 "
          color="primary-black"
        >
          Buy
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewOrderModal;
