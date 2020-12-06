import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <footer id="footer">
    <div className="content">
      <p>© 2020 POP TikR inc. All Rights Reserved</p>
      <Link to="/terms-conditions">Terms & Conditions</Link>
    </div>
  </footer>
);
