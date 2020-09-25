import React from "react";

const IsAuthenticatedFixture: React.FC<{
  isAuthenticated: boolean;
  isAdmin?: boolean;
}> = ({ isAuthenticated, isAdmin }) => {
  return (
    <>
      {isAuthenticated ? (
        <div>User is logged in.</div>
      ) : (
        <div>User is not logged in.</div>
      )}
      {isAuthenticated && isAdmin && <div>User is admin.</div>}
    </>
  );
};

export default IsAuthenticatedFixture;
