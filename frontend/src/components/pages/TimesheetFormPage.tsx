import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { isInteger } from "lodash";
import PageTitle from "components/PageTitle";
import TimesheetForm from "components/forms/TimesheetForm";
import { useAuth } from "context/auth";
import useFormController from "hooks/useFormController";
import DefaultLayout from "components/layouts/DefaultLayout";
import store from "store";
import { selectSettings } from "store/settings";
import { addTimesheet, selectTimesheets } from "store/timesheets";
import { Shift, ShiftTimes, Timesheet, User } from "types";
import { useHistory } from "react-router";
import { DateTime } from "luxon";
import LoadingPage from "./LoadingPage";
import Messages from "components/Messages";
import { Button } from "react-bootstrap";
import { useMessages } from "context/messages";
import { updateUser } from "store/users";

const TimesheetFormPage = () => {
  const { user, logout, refreshUser } = useAuth();
  const { setMessage } = useMessages();
  const history = useHistory();
  const { settings } = useSelector(selectSettings);
  const { error } = useSelector(selectTimesheets);

  const {
    formError,
    formPending,
    handleSubmit: handleSubmitTimesheet,
  } = useFormController<{
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
        setMessage(
          "success",
          <>
            <p>Your timesheet has been submitted.</p>
            <p>A copy has been emailed to you at {user?.email}</p>
            <Button variant="outline-dark" onClick={logout}>
              Click here to log out
            </Button>
          </>,
          ["timesheet-form"]
        );
        history.push("/");
      }
    } else {
      throw new Error(`User is not valid`);
    }
  });

  const handleSubmitDefaultShifts = async (defaultShifts: ShiftTimes[]) => {
    const updatedUser: User = Object.assign({}, user, { defaultShifts });
    const action = await store.dispatch(updateUser(updatedUser));
    if (action.type === "users/update/fulfilled") {
      setMessage("success", "Your default shifts have been updated.", [
        "timesheet-form",
      ]);
      await refreshUser();
    }
  };

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
    return <LoadingPage />;
  }

  return (
    <DefaultLayout>
      <PageTitle>New Timesheet</PageTitle>
      <Messages />
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <TimesheetForm
          defaultShifts={user.defaultShifts}
          defaultWeekStartDateTime={defaultWeekStartDateTime}
          onSubmitTimesheet={handleSubmitTimesheet}
          onSubmitDefaultShifts={handleSubmitDefaultShifts}
          pending={formPending}
        />
      </div>
    </DefaultLayout>
  );
};

export default TimesheetFormPage;
