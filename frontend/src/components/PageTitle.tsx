import React from "react";

const PageTitle: React.FC = ({ children }) => (
  <div className="page-title bg-white border-bottom mb-3">
    <div className="py-5 text-center">
      <h1>{children}</h1>
    </div>
  </div>
);

export default PageTitle;
