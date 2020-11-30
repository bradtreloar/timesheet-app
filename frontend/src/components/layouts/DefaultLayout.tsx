import React from "react";
import Navbar from "components/Navbar";
import "./DefaultLayout.scss";

const DefaultLayout: React.FC = ({ children }) => {
  return (
    <div className="page">
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default DefaultLayout;
