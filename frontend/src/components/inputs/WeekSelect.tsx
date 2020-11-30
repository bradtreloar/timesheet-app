import React from "react";
import {
  addDays,
  addWeek,
  longFormatDate,
  subtractWeek,
} from "services/date";

interface WeekSelectProps {
  value: Date;
  onChange: (value: Date) => void;
}

const WeekSelect: React.FC<WeekSelectProps> = ({ value, onChange }) => {
  const weekStartDate = value;
  const weekEndDate = addDays(weekStartDate, 6);
  const label = `${longFormatDate(weekStartDate)} to ${longFormatDate(
    weekEndDate
  )}`;

  function handleChange(forward: boolean) {
    onChange(forward ? addWeek(value) : subtractWeek(value));
  }

  return (
    <div className="d-flex">
      <button
        aria-label="previous week"
        className="btn btn-secondary"
        onClick={() => {
          handleChange(false);
        }}
      >
        Prev
      </button>
      <button
        aria-label="next week"
        className="btn btn-secondary"
        onClick={() => {
          handleChange(true);
        }}
      >
        Next
      </button>
      <div className="flex-grow-1">{label}</div>
    </div>
  );
};

export default WeekSelect;
