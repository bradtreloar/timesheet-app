import React, { useMemo, useState } from "react";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";
import { getTimesheetTotalHours } from "services/date";
import { Timesheet } from "types";
import Pager from "components/Pager";

const ITEMS_PER_PAGE = 10;

interface TimesheetTableProps {
  timesheets: Timesheet[];
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ timesheets }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const pageCount = useMemo(
    () =>
      timesheets.length > 0 ? Math.ceil(timesheets.length / ITEMS_PER_PAGE) : 0,
    [timesheets]
  );

  const firstItem = pageIndex * ITEMS_PER_PAGE;
  const lastItem = firstItem + ITEMS_PER_PAGE;
  const visibleTimesheets = timesheets.slice(firstItem, lastItem);

  const tableRows = visibleTimesheets.map((timesheet, index) => {
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
        <Pager
          pageIndex={pageIndex}
          pageCount={pageCount}
          onChange={setPageIndex}
        />
      </div>
    </>
  );
};

export default TimesheetTable;
