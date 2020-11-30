import * as React from "react";
import PageTitle from "components/PageTitle";

import DefaultLayout from "components/layouts/DefaultLayout";

const HomePage = () => (
  <DefaultLayout>
    <PageTitle>Home page</PageTitle>
    <div className="container"></div>
  </DefaultLayout>
);

export default HomePage;
