import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { isInteger } from "lodash";
import classnames from "classnames";
import PageTitle from "../components/PageTitle";
import TimesheetForm from "../components/TimesheetForm";
import { useAuth } from "../context/auth";
import useFormController from "../hooks/useFormController";
import { addDays } from "../helpers/date";
import DefaultLayout from "../layouts/DefaultLayout";
import store from "../store";
import { selectSettings } from "../store/settings";
import { addTimesheet, selectTimesheets } from "../store/timesheets";
import { Shift, Timesheet } from "../types";

const TimesheetPage = () => {
  const { user } = useAuth();
  const { settings } = useSelector(selectSettings);
  const { error } = useSelector(selectTimesheets);
  const { formError, formSubmitted, handleSubmit } = useFormController<{
    shifts: Shift[];
  }>(async ({ shifts }) => {
    if (user?.id) {
      const timesheet: Timesheet = {
        userID: user.id as string,
        shifts: shifts,
      };
      await store.dispatch(addTimesheet(timesheet));
    }
  });

  const firstDayOfWeek = useMemo(
    () => settings.find(({ name }) => name === "firstDayOfWeek")?.value,
    [settings]
  );

  const defaultWeekStartDate = useMemo(() => {
    if (firstDayOfWeek !== undefined && isInteger(parseInt(firstDayOfWeek))) {
      const date = new Date();
      const weekStartDate = addDays(
        date,
        parseInt(firstDayOfWeek) - date.getDay()
      );
      weekStartDate.setHours(0, 0, 0, 0);
      return weekStartDate;
    }
  }, [firstDayOfWeek]);

  if (!user) {
    throw new Error(`User is not logged in.`);
  }

  if (!defaultWeekStartDate) {
    throw new Error(`Unable to get the default start date for the timesheet.`);
  }

  return (
    <DefaultLayout>
      <PageTitle>New Timesheet</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <TimesheetForm
          className={classnames(formSubmitted && "was-submitted")}
          defaultShifts={user.defaultShifts}
          defaultWeekStartDate={defaultWeekStartDate}
          onSubmit={handleSubmit}
        />
      </div>
    </DefaultLayout>
  );
};

export default TimesheetPage;
