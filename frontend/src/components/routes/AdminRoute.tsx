import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "context/auth";
import AccessDeniedPage from "components/pages/AccessDeniedPage";

const AdminRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return isAdmin ? (
            children
          ) : (
            <AccessDeniedPage />
          );
        } else {
          return <Redirect
          to={{ pathname: "/login", state: { referer: props.location } }}
        />
        }
      }}
    />
  );
};

export default AdminRoute;
