import moment from "moment";
import _ from "lodash";

export function validateForm(errors) {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
}

export function validateFields(data, language = "en") {
  const getLangName = (name) => {
    return `translations.${language}.${name}`;
  };
  let errors = {};
  if (!_.get(data, getLangName("deal_name"), null))
    errors.deal_name = "Required";

  if (!_.get(data, getLangName("title"), null)) errors.title = "Required";

  if (!_.get(data, getLangName("description"), null))
    errors.description = "Required";

  if (!_.get(data, getLangName("fine_print"), null))
    errors.fine_print = "Required";

  const coupon_code = data["coupon_code"];
  if (!coupon_code) errors.coupon_code = "Required";
  else if (coupon_code.length < 4)
    errors.coupon_code = "Minimum 4 characters are required";

  if (!data["start_date"]) errors.start_date = "Required";

  if (!data["end_date"]) errors.end_date = "Required";

  if (data["start_date"] && data["end_date"]) {
    const diff = moment(data["end_date"]).diff(
      moment(data["start_date"]),
      "days"
    );

    if (diff < 0)
      errors.end_date = "End date should be greater or equal than start date";
  }
  if (!data["coupon_mode"]) errors.coupon_mode = "Required";

  if (!data["logo_path"]) errors.logo_path = "Required";

  if (!data["coupon_category"]) errors.coupon_category = "Required";

  if (
    (data["coupon_mode"] === "Nearby" || data["coupon_mode"] === "Both") &&
    !data["coupon_location"]
  )
    errors.coupon_location = "Required";
  if (
    (data["coupon_mode"] === "Online" || data["coupon_mode"] === "Both") &&
    !data["coupon_national"]
  )
    errors.coupon_location = "Required";

  return errors;
}

export function convertBoolean(data) {
  switch (typeof data) {
    case "string":
      return Number(data);
    case "boolean":
      return +data;
    default:
      return data;
  }
}

export function formatTranslations(dealData) {
  if (dealData) {
    const empty = {
      deal_name: "",
      title: "",
      description: "",
      fine_print: "",
    };
    let frLang = empty,
      enLang = empty;

    if (
      dealData.translations &&
      Object.keys(dealData.translations).length > 0
    ) {
      frLang =
        dealData.translations.fr && Object.keys(dealData.translations.fr).length
          ? dealData.translations.fr
          : empty;
      enLang =
        dealData.translations.en && Object.keys(dealData.translations.en).length
          ? dealData.translations.en
          : empty;
    }

    const translations = {
      fr: {
        deal_name: frLang.deal_name,
        title: frLang.title,
        description: frLang.description,
        fine_print: frLang.fine_print,
      },
      en: {
        deal_name:
          enLang.deal_name || dealData.deal_name || frLang.deal_name || "",
        title: enLang.title || dealData.title || frLang.title || "",
        description:
          enLang.description ||
          dealData.description ||
          frLang.description ||
          "",
        fine_print:
          enLang.fine_print || dealData.fine_print || frLang.fine_print || "",
      },
    };
    return translations;
  }
  return {};
}

export function getFormattedData(dealData, deal_price) {
  const service_tax = 0,
    tax = 0,
    discount = 0;
  const duration = moment(dealData.end_date).diff(
    moment(dealData.start_date),
    "days"
  );
  const subtotal = deal_price * duration + service_tax + tax;
  // const remaining = subtotal - merchantDiscount;
  //const discount = (subtotal - remaining) < 0 ? 0 : subtotal - remaining;
  //const total = remaining < 0 ? 0 : remaining;
  const translations = formatTranslations(dealData);

  const payload = {
    ...dealData,
    all_location: 0, //convertBoolean(dealData.all_location),
    quantity: Number(dealData.quantity),
    coupon_type: "Fixed",
    deal_price,
    service_tax,
    tax,
    subtotal,
    total: subtotal,
    discount,
    duration,
    status: dealData.status || "Inactive",
    start_date: moment(dealData.start_date).format("YYYY-MM-DD"),
    end_date: moment(dealData.end_date).format("YYYY-MM-DD"),
    logo: dealData.logo || "",
    online_url: dealData.online_url || "",
    redeem_once_per_day: dealData.redeem_once_per_day || 0,
    redeem_early_x_number: dealData.redeem_early_x_number || 0,
    redeem_early_qty: dealData.redeem_early_qty || 0,
    everyday_recurring: dealData.everyday_recurring || 0,
    coupon_location: dealData.coupon_location || [],
    coupon_national: dealData.coupon_national || [],
    week_specific_day_recurring: dealData.week_specific_day_recurring || 0,
    translations,
    ...translations.en,
  };
  return payload;
}
