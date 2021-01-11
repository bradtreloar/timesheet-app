import React from "react";
import { useSelector } from "react-redux";
import PageTitle from "components/PageTitle";
import TimesheetForm from "components/forms/TimesheetForm";
import { useAuth } from "context/auth";
import useFormController from "hooks/useFormController";
import DefaultLayout from "components/layouts/DefaultLayout";
import store from "store";
import { addTimesheet, selectTimesheets } from "store/timesheets";
import { Shift, ShiftValues, Timesheet, User } from "types";
import { useHistory } from "react-router";
import Messages from "components/Messages";
import { Button } from "react-bootstrap";
import { useMessages } from "context/messages";
import { updateUser } from "store/users";

const TimesheetFormPage = () => {
  const { user, logout, refreshUser } = useAuth();
  const { setMessage } = useMessages();
  const history = useHistory();
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

  const handleSubmitDefaultShifts = async (defaultShiftValues: ShiftValues[]) => {
    const updatedUser: User = Object.assign({}, user, { defaultShiftValues });
    const action = await store.dispatch(updateUser(updatedUser));
    if (action.type === "users/update/fulfilled") {
      setMessage("success", "Your default shifts have been updated.", [
        "timesheet-form",
      ]);
      await refreshUser();
    }
  };

  if (!user) {
    throw new Error(`User is not logged in.`);
  }

  return (
    <DefaultLayout>
      <PageTitle>New Timesheet</PageTitle>
      <Messages />
      <div className="container">
        {formError && <div className="alert alert-danger">{formError}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <TimesheetForm
          defaultShiftValues={user.defaultShiftValues}
          onSubmitTimesheet={handleSubmitTimesheet}
          onSubmitDefaultShiftValues={handleSubmitDefaultShifts}
          pending={formPending}
        />
      </div>
    </DefaultLayout>
  );
};

export default TimesheetFormPage;
