import React from "react";
import { Link } from "react-router-dom";
import {
  formattedDate,
  getShiftHours,
  getTimesheetTotalHours,
} from "services/date";
import { Timesheet } from "types";

interface TimesheetTableProps {
  timesheets: Timesheet[];
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ timesheets }) => {
  const rows = timesheets.map((timesheet, index) => {
    const created = formattedDate(new Date(timesheet.created as string));
    const totalHours = getTimesheetTotalHours(timesheet);
    const pathname = `/timesheet/${timesheet.id}`;

    return (
      <tr key={index}>
        <td>
          <Link to={pathname}>{created}</Link>
        </td>
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
