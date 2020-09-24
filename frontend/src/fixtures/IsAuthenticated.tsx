import React from "react";

const IsAuthenticatedFixture: React.FC<{
  isAuthenticated: boolean;
}> = ({ isAuthenticated }) => {
  return isAuthenticated ? (
    <div>User is logged in.</div>
  ) : (
    <div>User is not logged in.</div>
  );
};

export default IsAuthenticatedFixture;
