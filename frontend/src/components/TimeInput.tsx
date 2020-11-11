import React from "react";
import { SimpleTime } from "../helpers/date";

interface TimeInputProps {
  time: SimpleTime | null;
  onChange: (time: SimpleTime | null) => void;
  "aria-label"?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  time,
  onChange,
  "aria-label": ariaLabel,
}) => {
  const [hours, minutes] = time !== null ? time.toArray() : [null, null];
  const [padded, setPadded] = React.useState(true);

  const parseValue = (value: string) => {
    return value === "" ? null : parseInt(value);
  };

  const formattedValue = (value: number) => {
    return value !== null
      ? padded
        ? value.toString().padStart(2, "0")
        : value.toString()
      : "";
  };

  return (
    <div aria-label={ariaLabel}>
      <input
        type="number"
        aria-label="Hours"
        min={0}
        max={23}
        step={1}
        required
        value={hours !== null ? hours.toString() : ""}
        onChange={(event) => {
          const newHours = parseValue(event.target.value);
          onChange(new SimpleTime(newHours, minutes));
        }}
        onFocus={() => {
          setPadded(false);
        }}
        onBlur={() => {
          setPadded(true);
        }}
      />
      <span className="mx-1">:</span>
      <input
        type="number"
        aria-label="Minutes"
        min={0}
        max={59}
        step={1}
        required
        value={minutes !== null ? minutes.toString() : ""}
        onChange={(event) => {
          const newMinutes = parseValue(event.target.value);
          onChange(new SimpleTime(hours, newMinutes));
        }}
        onFocus={() => {
          setPadded(false);
        }}
        onBlur={() => {
          setPadded(true);
        }}
      />
    </div>
  );
};

export default TimeInput;
