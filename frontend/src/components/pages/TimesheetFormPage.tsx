import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { isInteger } from "lodash";
import classnames from "classnames";
import PageTitle from "components/PageTitle";
import TimesheetForm from "components/forms/TimesheetForm";
import { useAuth } from "context/auth";
import useFormController from "hooks/useFormController";
import DefaultLayout from "components/layouts/DefaultLayout";
import store from "store";
import { selectSettings } from "store/settings";
import { addTimesheet, selectTimesheets } from "store/timesheets";
import { Shift, Timesheet } from "types";
import { useHistory } from "react-router";
import { DateTime } from "luxon";
import LoadingPage from "./LoadingPage";

const TimesheetFormPage = () => {
  const { user } = useAuth();
  const history = useHistory();
  const { settings } = useSelector(selectSettings);
  const { error } = useSelector(selectTimesheets);
  const { formError, formPending, handleSubmit } = useFormController<{
    shifts: Shift[];
    comment: string;
  }>(async ({ shifts, comment }) => {
    if (user?.id) {
      const timesheet: Timesheet = {
        userID: user.id,
        shifts: shifts,
        comment,
      };
      const action = await store.dispatch(addTimesheet(timesheet));
      if (action.type === "timesheets/add/fulfilled") {
        history.push("/timesheet/confirmation");
      }
    } else {
      throw new Error(`User is not valid`);
    }
  });

  const firstDayOfWeek = useMemo(
    () => settings.find(({ name }) => name === "firstDayOfWeek")?.value,
    [settings]
  );

  const defaultWeekStartDateTime = useMemo(() => {
    if (firstDayOfWeek !== undefined && isInteger(parseInt(firstDayOfWeek))) {
      return DateTime.local().set({
        weekday: parseInt(firstDayOfWeek),
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    }
  }, [firstDayOfWeek]);

  if (!user) {
    throw new Error(`User is not logged in.`);
  }

  if (!defaultWeekStartDateTime) {
    return (
      <LoadingPage />
    );
  }

  return (
    <DefaultLayout>
      <PageTitle>New Timesheet</PageTitle>
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <TimesheetForm
          className={classnames(formPending && "is-pending")}
          defaultShifts={user.defaultShifts}
          defaultWeekStartDateTime={defaultWeekStartDateTime}
          onSubmitTimesheet={handleSubmit}
        />
      </div>
    </DefaultLayout>
  );
};

export default TimesheetFormPage;
