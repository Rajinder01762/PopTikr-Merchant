import validator from "validator";
let errors = {};
export function validateBillingFields(data) {
  // if(!validator.isBoolean(stripeCC)){
  // }
  // if (!data["cardNumber"]) {
  //   errors.cardNumber = "Card number is required";
  // } else if (
  //   data["cardNumber"] &&
  //   data["cardNumber"].length <= 16 &&
  //   !validator.isCreditCard(data["cardNumber"])
  // ) {
  //   errors.cardNumber = "Card number is invalid!";
  // }
  // if (!data["cardName"]) {
  //   errors.cardName = "Name on card is required";
  // }
  // if (!data["cardCVV"]) {
  //   errors.cardCVV = "CVV is required";
  // }
  // if (!data["cardExpiry"]) {
  //   errors.cardExpiry = "Card expiry is required";
  // } else if (data["cardExpiry"]) {
  //   if (!validator.toDate(data["cardExpiry"])) {
  //     errors.cardExpiry = "Card expiry is invalid";
  //   }
  // }
  if (!data["firstName"]) {
    errors.firstName = "First Name is required";
  }
  if (!data["lastName"]) {
    errors.lastName = "Last Name is required";
  }
  if (!data["address"]) {
    errors.address = "Address is required";
  }
  // if (!data["address2"]) {
  //   errors.address2 = "Address line 2 is required";
  // }
  if (!data["city"]) {
    errors.city = "City is required";
  }
  if (!data["province"]) {
    errors.province = "Province is required";
  }
  if (!data["zipCode"]) {
    errors.zipCode = "Zip Code is required";
  }
  return errors;
}
