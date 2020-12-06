import validator from "validator";
let errors = {};
export function validateLocationFields(data) {
  if (!data["location_name"]) {
    errors.address = "Location name is required";
  }
  if (!data["address"]) {
    errors.address = "Address is required";
  }
  if (!data["lat"]) {
    errors.lat = "Latitude is required";
  }
  if (!data["lng"]) {
    errors.lng = "Longitude is required";
  } else if (data["lng"]) {
    const isLatLong = validator.isLatLong(`${data["lat"]},${data["lng"]}`);
    if (!isLatLong) errors.lng = "Enter valid longitude";
  }

  if (data["lat"]) {
    const isLatLong = validator.isLatLong(`${data["lat"]},${data["lng"]}`);
    if (!isLatLong) errors.lng = "Enter valid Latitude";
  }
  if (!data["timezone"]) {
    errors.timezone = "Please select timezone";
  }

  // if (data["phone"] && !validator.isMobilePhone(data["phone"])) {
  //   errors.phone = "Enter a valid phone number";
  // }

  if (
    !data["category_id"] ||
    (data["category_id"] && data["category_id"].length <= 0)
  ) {
    errors.category_id = "Please select a category";
  }

  return errors;
}

export function validateLocationForm(errors) {
  let valid = true;
  Object.keys(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
}

export const formatLocationData = (data) => {
  return {
    category_id: data.category_id || [],
    tax_id: data.tax_id || "",
    location_name: data.location_name || "",
    address: data.address || "",
    lat: data.lat || "",
    lng: data.lng || "",
    timezone: data.timezone || "",
    website: data.website || "",
    phone: data.phone || "",
    working_time_su: fixTimeValues(data.working_time_su),
    working_time_mo: fixTimeValues(data.working_time_mo),
    working_time_tu: fixTimeValues(data.working_time_tu),
    working_time_we: fixTimeValues(data.working_time_we),
    working_time_th: fixTimeValues(data.working_time_th),
    working_time_fr: fixTimeValues(data.working_time_fr),
    working_time_sa: fixTimeValues(data.working_time_sa),
    is_primary: data.is_primary || 0,
  };
};

function fixTimeValues(data) {
  return {
    status: data ? data.status : "",
    opentime_hh: data ? data.opentime_hh : "",
    opentime_mm: data ? data.opentime_mm : "",
    closetime_hh: data ? data.closetime_hh : "",
    closetime_mm: data ? data.closetime_mm : "",
  };
}
