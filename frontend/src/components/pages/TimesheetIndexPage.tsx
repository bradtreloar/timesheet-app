import React from "react";
import PageTitle from "components/PageTitle";
import DefaultLayout from "components/layouts/DefaultLayout";
import { Link } from "react-router-dom";
import TimesheetTable from "components/tables/TimesheetTable";
import { useSelector } from "react-redux";
import { selectTimesheets } from "store/timesheets";
import Messages from "components/Messages";

const TimesheetIndexPage = () => {
  const { timesheets, status: timesheetStoreStatus } = useSelector(
    selectTimesheets
  );

  return (
    <DefaultLayout>
      <PageTitle>Timesheets</PageTitle>
      <Messages />
      <div className="container">
        <div className="my-3">
          <Link className="btn btn-primary" to="/timesheet/new">
            Create new timesheet
          </Link>
        </div>
        {timesheetStoreStatus === "pending" ? (
          <p>Loading...</p>
        ) : timesheets.length > 0 ? (
          <TimesheetTable timesheets={timesheets} />
        ) : (
          <p>You don't have any timesheets, yet.</p>
        )}
      </div>
    </DefaultLayout>
  );
};

export default TimesheetIndexPage;
