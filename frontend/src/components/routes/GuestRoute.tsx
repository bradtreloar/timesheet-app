import React from "react";
import { Route, Redirect, RouteProps, useLocation } from "react-router-dom";
import { useAuth } from "context/auth";

const GuestRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation<{
    referer?: Location;
  }>();

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{ pathname: location.state?.referer?.pathname || "/" }}
          />
        )
      }
    />
  );
};

export default GuestRoute;
