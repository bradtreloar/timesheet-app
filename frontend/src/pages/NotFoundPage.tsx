import * as React from "react";

import DefaultLayout from "../layouts/DefaultLayout";

const NotFoundPage = () => (
  <DefaultLayout>
    <div className="container">
      <h1>404: Page not found.</h1>
      <p>
        The page you are looking for does not exist.{" "}
        <a href="/">Return to the home page.</a>
      </p>
    </div>
  </DefaultLayout>
);

export default NotFoundPage;
