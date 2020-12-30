import { DateTime } from "luxon";
import React from "react";

interface WeekSelectProps {
  value: DateTime;
  onChange: (value: DateTime) => void;
}

const WeekSelect: React.FC<WeekSelectProps> = ({ value, onChange }) => {
  const fromLabel = value.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
  const toLabel = value.plus({ days: 6 }).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
  const label = `${fromLabel} to ${toLabel}`;

  function handleChange(forward: boolean) {
    onChange(forward ? value.plus({ weeks: 1 }) : value.minus({ weeks: 1 }));
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
