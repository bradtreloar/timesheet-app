import React from "react";
import Navbar from "../components/Navbar";

const DefaultLayout: React.FC = ({ children }) => {
  return (
    <div className="page">
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default DefaultLayout;
