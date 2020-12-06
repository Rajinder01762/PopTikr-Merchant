import validator from "validator";

export function validateDetailsFormFields(data, isRegister) {
  let errors = {};
  if (!data["company_name"]) {
    errors.company_name = "Company name is required";
  }
  if (!data["category_id"] || data["category_id"].length < 1) {
    errors.category_id = "Please select a category";
  }
  if (!data["first_name"]) {
    errors.first_name = "Firstname is required";
  }
  if (!data["last_name"]) {
    errors.last_name = "Lastname is required";
  }
  if (!data["email"]) {
    errors.email = "Email is required";
  }
  if (data["email"] && !validateEmail(data["email"])) {
    errors.email = "Enter a valid email address";
  }
  // if (data["phone"] && !validator.isMobilePhone(data["phone"])) {
  //   errors.phone = "Phone number is required";
  // }
  if (!data["phone"]) {
    errors.phone = "Phone number is required";
  }
  if (!data["program_id"]) {
    errors.program_id = "Please select a program";
  }
  if (!data["bn_number"]) {
    errors.bn_number = "BN number is required";
  }
  if (data["bn_number"] && !validateNumber(data["bn_number"])) {
    errors.bn_number = "Enter a valid BN number";
  }

  if (!data["document_file"]) {
    errors.document_file = "Document is required";
  }

  if (isRegister && !data["agreeConditions"]) {
    errors.agreeConditions =
      "Please select that you have agree to the Terms and Conditions and Privacy Policy";
  }
  // if (!data["merchant_policy"] || data["merchant_policy"] === null) {
  //   errors.merchant_policy =
  //     "Please select that you have agree to the Terms and Conditions and Privacy Policy";
  // }
  return errors;
}

export function validateForm(errors) {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
}

export function validateEmail(email) {
  let res = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return res.test(String(email).toLowerCase());
}

export function validateNumber(phone) {
  var reg = new RegExp("^[0-9]+$");
  if (reg.test(phone)) {
    return true;
  } else {
    return false;
  }
}

export const formatDetailsFormData = (data, isRegister) => {
  let obj = {
    company_name: data.company_name || "",
    category_id: data.category_id || [],
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    email: data.email || "",
    phone: data.phone || "",
    program_id: data.program_id || "",
    bn_number: data.bn_number || "",
    document_file: data.document_file || "",
    made_in: data.made_in || "",
    merchant_policy: data.merchant_policy || "",
  };
  if (isRegister) {
    delete obj.merchant_policy;
    return obj;
  } else {
    return obj;
  }
};
