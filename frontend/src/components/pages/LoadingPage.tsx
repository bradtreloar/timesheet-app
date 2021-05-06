import Throbber from "components/Throbber";
import * as React from "react";
import "./LoadingPage.scss";

const LoadingPage = () => (
  <div className="page loading-page">
    <div className="d-flex h-100 justify-content-center align-items-center">
      <Throbber />
      <p className="sr-only">
        Loading...
      </p>
    </div>
  </div>
);

export default LoadingPage;
