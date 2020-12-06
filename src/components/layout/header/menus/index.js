import React from "react";
import { Link, useHistory } from "react-router-dom";
import cx from "classnames";
const menusData = [
  {
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    name: "Deals",
    link: "/deals",
  },
  {
    name: "Profile",
    link: "/profile",
  },
  {
    name: "Billing",
    link: "/billing",
  },
];

const adminMenu = [
  {
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    name: "Profile",
    link: "/profile",
  },
  {
    name: "Program",
    link: "/programs",
  },
  {
    name: "Tax",
    link: "/tax",
  },
  {
    name: "Timezone",
    link: "/timezone",
  },
  {
    name: "Users",
    link: "/users",
  },
  {
    name: "Categories",
    link: "/categories",
  },
  {
    name: "CMS",
    link: "/cms",
  },
  {
    name: "Merchant",
    link: "/merchant",
  },
  {
    name: "Settings",
    link: "/settings",
  },
];

const Meuns = ({ locations }) => {
  const history = useHistory();
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const menu = isAdmin ? adminMenu : menusData;
  const { location } = history;
  const { pathname } = location;

  return (
    <ul className="d-flex menus">
      {menu.map(({ name, link }, key) => (
        <li key={key}>
          <Link className={cx({ active: pathname.includes(link) })} to={link}>
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Meuns;
