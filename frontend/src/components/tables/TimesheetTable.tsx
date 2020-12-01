import React from "react";
import { formattedDate, getShiftHours, getTimesheetTotalHours } from "services/date";
import { Timesheet } from "types";

interface TimesheetTableProps {
  timesheets: Timesheet[];
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ timesheets }) => {
  const rows = timesheets.map((timesheet, index) => {
    const created = formattedDate(new Date(timesheet.created as string));
    const totalHours = getTimesheetTotalHours(timesheet);

    return (
      <tr key={index}>
        <td>{created}</td>
        <td>{totalHours}</td>
      </tr>
    );
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date submitted</th>
          <th>Total hours</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default TimesheetTable;
