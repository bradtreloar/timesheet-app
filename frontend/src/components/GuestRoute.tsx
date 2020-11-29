import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../context/auth";

const GuestRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{ pathname: "/" }}
          />
        )
      }
    />
  );
};

export default GuestRoute;
