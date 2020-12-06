export function generateQueryParameters(options) {
  if (options) {
    const keys = Object.keys(options);
    if (keys.length >= 1) {
      let queryString = "?";
      keys.forEach((item) => {
        if (Array.isArray(options[item])) {
          options[item].forEach((sub) => {
            queryString = `${queryString}${item}=${encodeURIComponent(sub)}&`;
          });
        } else {
          if (options[item])
            queryString = `${queryString}${item}=${encodeURIComponent(
              options[item]
            )}&`;
        }
      });
      return queryString;
    } else {
      return "";
    }
  }
  return "";
}

export const convertValuesToOption = (attributes) => {
  return attributes.map((attribute) => convertValueToOption(attribute));
};

export const convertValueToOption = (attribute) => {
  return attribute
    ? {
        label: attribute,
        value: attribute,
      }
    : "";
};

export const convertOptionsToValue = (options) => {
  return options ? options.map((option) => option.value) : [];
};

export const convertOptionToValue = (option) => {
  return option && option.value;
};

export const randomCoupenCode = (length) => {
  let code = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < length; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
};

export const toggleValueInArray = (arr, value) => {
  if (arr) {
    const index = arr.findIndex((item) => item === value);
    index > -1 ? arr.splice(index, 1) : arr.push(value);
  }

  return arr;
};

export function getCustomOptions(value, data, id, label) {
  const optionValues = [];

  if (value && data && value.length > 0 && data.length > 0) {
    value.forEach((selected) => {
      const item = data.find((itm) => itm[id] && itm[id] === selected);
      optionValues.push({
        value: selected,
        label: item && item[label],
      });
    });
    return optionValues;
  }
  return null;
}

export function cardType(cardNumber) {
  // returns card type; should not rely on this for checking if a card is valid
  cardNumber = cardNumber.split(" ").join("");
  var o = {
    Electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
    Maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
    Dankort: /^(5019)\d+$/,
    Interpayment: /^(636)\d+$/,
    Unionpay: /^(62|88)\d+$/,
    Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    Mastercard: /^5[1-5][0-9]{14}$/,
    Amex: /^3[47][0-9]{13}$/,
    Diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    Jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
  };
  for (var k in o) {
    if (o[k].test(cardNumber)) {
      return k;
    }
  }
  return null;
}

export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
