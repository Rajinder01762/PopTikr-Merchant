export const weeks = [
  { week: "su", day: "Sunday" },
  { week: "mo", day: "Monday" },
  { week: "tu", day: "Tuesday" },
  { week: "we", day: "Wednesday" },
  { week: "th", day: "Thursday" },
  { week: "fr", day: "Friday" },
  { week: "sa", day: "Saturday" },
];

export const weekDays = {
  su: "Sunday",
  mo: "Monday",
  tu: "Tuesday",
  we: "Wednesday",
  th: "Thursday",
  fr: "Friday",
  sa: "Saturday",
};

export const shopStatus = [
  { label: "Open", value: "Open" },
  { label: "Closed", value: "Closed" },
];

export const timeHours = formatHours();

function formatHours() {
  const hours = [];
  for (let i = 1; i <= 23; i++) {
    let obj = { label: i > 9 ? i : "0" + i.toString(), value: "hours" };
    hours.push(obj);
  }
  return hours;
}

export const timeMinutes = [
  { label: "00", value: "minutes" },
  { label: "10", value: "minutes" },
  { label: "20", value: "minutes" },
  { label: "30", value: "minutes" },
  { label: "40", value: "minutes" },
  { label: "50", value: "minutes" },
];
