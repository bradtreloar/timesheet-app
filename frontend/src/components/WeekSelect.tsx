import React from "react";
import { endOfWeek, longFormatDate } from "../helpers/date";

interface WeekSelectProps {
  weekStartDate: Date;
  onChangeWeek: (forward: boolean) => void;
}

const WeekSelect: React.FC<WeekSelectProps> = ({
  weekStartDate,
  onChangeWeek,
}) => {
  const weekEndDate = endOfWeek(weekStartDate);
  const label = `${longFormatDate(weekStartDate)} to ${longFormatDate(
    weekEndDate
  )}`;

  return (
    <div className="d-flex">
      <button
        aria-label="previous week"
        className="btn btn-secondary"
        onClick={() => {
          onChangeWeek(false);
        }}
      >
        Prev
      </button>
      <button
        aria-label="next week"
        className="btn btn-secondary"
        onClick={() => {
          onChangeWeek(true);
        }}
      >
        Next
      </button>
      <div className="flex-grow-1">{label}</div>
    </div>
  );
};

export default WeekSelect;
