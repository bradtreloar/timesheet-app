import React from "react";

const PageTitle: React.FC = ({ children }) => (
  <div className="container mb-3">
    <div className="py-3">
      <h1>{children}</h1>
    </div>
  </div>
);

export default PageTitle;
