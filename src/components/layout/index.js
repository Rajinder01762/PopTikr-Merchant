import React from "react";
import Header from "./header";
import Footer from "./footer";
import classes from "./styles.module.scss";
import cx from "classnames";

export default ({ children }) => (
  <div className>
    <Header />
    <main className={cx("bg-primary-light", classes.main)}>{children}</main>
    <Footer />
  </div>
);
