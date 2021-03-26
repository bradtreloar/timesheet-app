import { getWeekStartDate } from "helpers/timesheet";
import React from "react";
import { Button } from "react-bootstrap";

interface TimesheetConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  timesheet: Timesheet;
  isRepeatTimesheet: boolean;
}

const TimesheetConfirmDialog: React.FC<TimesheetConfirmDialogProps> = ({
  onConfirm,
  onCancel,
  timesheet,
  isRepeatTimesheet,
}) => {
  const timesheetStartDate = getWeekStartDate(timesheet).toFormat(
    "EEE d LLL yyyy"
  );

  return (
    <div>
      <div>
        {isRepeatTimesheet ? (
          <p>
            You've already submitted a timesheet for the week beginning on{" "}
            {timesheetStartDate}.
          </p>
        ) : (
          <p>
            Submit timesheet for the week beginning on {timesheetStartDate}?
          </p>
        )}
      </div>
      <div>
        <Button variant="secondary" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onConfirm()}>
          {isRepeatTimesheet ? `Submit Again` : `Submit`}
        </Button>
      </div>
    </div>
  );
};

export default TimesheetConfirmDialog;
