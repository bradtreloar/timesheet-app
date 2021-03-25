import React from "react";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";
import { getTimesheetTotalHours } from "services/date";
import usePagination from "hooks/usePagination";

interface TimesheetTableProps {
  timesheets: Timesheet[];
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ timesheets }) => {
  const { items, Pager } = usePagination(timesheets);

  const tableRows = items.map((timesheet, index) => {
    const created = DateTime.fromISO(
      timesheet.created as string
    ).toLocaleString(DateTime.DATE_SHORT);
    const totalHours = getTimesheetTotalHours(timesheet);
    const pathname = `/timesheet/${timesheet.id}`;

    return (
      <tr key={index}>
        <td>
          <Link to={pathname}>{created}</Link>
        </td>
        <td className="text-right">{totalHours} hours</td>
      </tr>
    );
  });

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>Date submitted</th>
            <th className="text-right">Total hours</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
      <div>
        <Pager />
      </div>
    </>
  );
};

export default TimesheetTable;
