import React from "react";
import PageTitle from "components/PageTitle";

import DefaultLayout from "components/layouts/DefaultLayout";
import { useAuth } from "context/auth";
import { Button } from "react-bootstrap";

const TimesheetConfirmPage = () => {
  const { user, logout } = useAuth();

  return (
    <DefaultLayout>
      <PageTitle>Timesheet submitted</PageTitle>
      <div className="container">
        <p>Your timesheet has been submitted.</p>
        <p>A copy has been emailed to you at {user?.email}</p>
        <Button onClick={logout}>Click here to log out</Button>
      </div>
    </DefaultLayout>
  );
};

export default TimesheetConfirmPage;
