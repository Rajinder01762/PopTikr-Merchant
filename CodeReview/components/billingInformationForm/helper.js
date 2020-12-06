import validator from "validator";
let errors = {};
export function validateBillingFields(data) {
  if (!data["firstName"]) {
    errors.firstName = "First Name is required";
  }
  if (!data["lastName"]) {
    errors.lastName = "Last Name is required";
  }
  if (!data["address"]) {
    errors.address = "Address is required";
  }
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
