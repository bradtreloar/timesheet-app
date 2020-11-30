import React from "react";
import { formattedDate } from "services/date";
import { Timesheet } from "types";

interface TimesheetTableProps {
  timesheets: Timesheet[];
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ timesheets }) => {
  const rows = timesheets.map((timesheet, index) => {
    const created = new Date(timesheet.created as string);
    return (
      <tr key={index}>
        <td>{formattedDate(created)}</td>
      </tr>
    );
  });

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default TimesheetTable;
