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