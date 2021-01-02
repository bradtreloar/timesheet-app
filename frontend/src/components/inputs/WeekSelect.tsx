import React from "react";
import { DateTime } from "luxon";
import classnames from "classnames";
import { Button } from "react-bootstrap";

interface WeekSelectProps {
  value: DateTime;
  onChange: (value: DateTime) => void;
  className?: string;
}

const WeekSelect: React.FC<WeekSelectProps> = ({
  value,
  onChange,
  className,
}) => {
  const fromLabel = value.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
  const toLabel = value
    .plus({ days: 6 })
    .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
  const label = `${fromLabel} to ${toLabel}`;

  const fromShortLabel = value.toLocaleString(DateTime.DATE_SHORT);
  const toShortLabel = value
    .plus({ days: 6 })
    .toLocaleString(DateTime.DATE_SHORT);
  const shortLabel = `${fromShortLabel} - ${toShortLabel}`;

  function handleChange(forward: boolean) {
    onChange(forward ? value.plus({ weeks: 1 }) : value.minus({ weeks: 1 }));
  }

  return (
    <div className={classnames("btn-group bg-light", className)}>
      <Button
        className="flex-grow-0"
        aria-label="previous week"
        variant="outline-secondary"
        onClick={() => {
          handleChange(false);
        }}
      >
        Prev
      </Button>
      <div className="p-2 px-3 flex-grow-1 text-center border-top border-bottom">
        <small className="d-sm-none">{shortLabel}</small>
        <span className="d-none d-sm-block d-md-none">{shortLabel}</span>
        <span className="d-none d-md-block">{label}</span>
      </div>
      <Button
        className="flex-grow-0"
        aria-label="next week"
        variant="outline-secondary"
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
