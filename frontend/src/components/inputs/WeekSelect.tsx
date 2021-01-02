import { DateTime } from "luxon";
import React from "react";
import { Button } from "react-bootstrap";

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
    <div className="btn-group">
      <Button
        aria-label="previous week"
        variant="outline-dark"
        onClick={() => {
          handleChange(false);
        }}
      >
        Prev
      </Button>
      <div className="p-2 px-3 border-top border-bottom border-dark">{label}</div>
      <Button
        aria-label="next week"
        variant="outline-dark"
        onClick={() => {
          handleChange(true);
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default WeekSelect;
